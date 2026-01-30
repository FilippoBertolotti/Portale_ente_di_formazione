import pool from './config/database.js';

async function testConnection() {
  try {
    console.log('🔄 Test connessione al database...\n');
    
    const result = await pool.query('SELECT NOW() as current_time, version() as pg_version');
    
    console.log('✅ Connessione al database riuscita!');
    console.log('📅 Ora corrente:', result.rows[0].current_time);
    console.log('🐘 Versione PostgreSQL:', result.rows[0].pg_version.split(',')[0]);
    
    // Test creazione tabelle
    const tablesResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    
    console.log('\n📊 Tabelle presenti nel database:');
    if (tablesResult.rows.length > 0) {
      tablesResult.rows.forEach(row => {
        console.log(`   - ${row.table_name}`);
      });
    } else {
      console.log('   Nessuna tabella trovata. Esegui lo schema.sql per crearle.');
    }
    
    await pool.end();
    console.log('\n✅ Test completato con successo!');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Errore nella connessione al database:');
    console.error(error.message);
    console.error('\nControlla:');
    console.error('1. PostgreSQL è in esecuzione?');
    console.error('2. Le credenziali nel file .env sono corrette?');
    console.error('3. Il database esiste?');
    process.exit(1);
  }
}

testConnection();