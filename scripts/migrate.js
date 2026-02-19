import fs from 'fs'
import path from 'path'
import https from 'https'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const PROJECT_REF = 'rqttrhhzsjgaswjuhscv'
const PAT = 'sbp_94d01352c9ae0212cb4fbd37a1325ae582e683f8'

function query(sql) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({ query: sql })
    const req = https.request({
      hostname: 'api.supabase.com',
      path: `/v1/projects/${PROJECT_REF}/database/query`,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PAT}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
      },
    }, (res) => {
      let data = ''
      res.on('data', d => data += d)
      res.on('end', () => {
        try {
          const json = JSON.parse(data)
          if (json.error || (Array.isArray(json) && json[0]?.message)) {
            reject(new Error(json.error || json[0]?.message))
          } else {
            resolve(json)
          }
        } catch {
          resolve(data)
        }
      })
    })
    req.on('error', reject)
    req.write(body)
    req.end()
  })
}

async function main() {
  const sql = fs.readFileSync(
    path.join(__dirname, '../supabase/migrations/0001_initial_schema.sql'),
    'utf8'
  )

  console.log('Executando migration...\n')

  // Run the entire migration as one transaction
  try {
    await query(sql)
    console.log('✓ Migration executada com sucesso!\n')
  } catch (e) {
    // If full migration fails (e.g. already exists), try to check state
    if (e.message?.includes('already exists')) {
      console.log('⚠ Alguns objetos já existem, verificando estado...\n')
    } else {
      console.error('Erro na migration:', e.message)
      process.exit(1)
    }
  }

  // Verify state
  console.log('Verificando banco de dados...')
  const tables = await query(`
    SELECT table_name FROM information_schema.tables
    WHERE table_schema = 'public'
    ORDER BY table_name
  `)
  console.log('Tabelas:', tables.map(t => t.table_name).join(', '))

  const processes = await query('SELECT COUNT(*) as n FROM processes')
  console.log(`Processos: ${processes[0].n}`)

  const tasks = await query('SELECT COUNT(*) as n FROM tasks')
  console.log(`Tarefas: ${tasks[0].n}`)

  const summary = await query('SELECT * FROM process_summary')
  console.log('process_summary view:', JSON.stringify(summary[0]))
}

main().catch(err => {
  console.error('Erro fatal:', err.message)
  process.exit(1)
})
