const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Credentials from .env.local
const supabaseUrl = 'https://yjocgelojlzrnnsotvgj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlqb2NnZWxvamx6cm5uc290dmdqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxNTQ1NjYsImV4cCI6MjA5MTczMDU2Nn0.OkJpTyweZAqWwGF3mNGqAHgiPgP0K77udiccPvzKVGw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedColleges() {
  try {
    const jsonPath = path.join(__dirname, 'web', 'src', 'data', 'colleges.json');
    const colleges = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

    console.log(`Starting insertion of ${colleges.length} colleges...`);

    // Note: This script assumes a table 'colleges' exists with matching column names.
    // If the columns don't match, you may need to map them here.
    
    // We'll map the keys to snake_case for standard database practices
    const mappedColleges = colleges.map(c => ({
      university_name: c["University Name"],
      tier: c["Tier"],
      state: c["State"],
      application_deadline: c["Application Deadline"],
      application_fee: c["Application Fee (INR)"],
      proprietary_test: c["Proprietary Test"],
      cuet_policy: c["CUET Acceptance Policy"],
      accreditation: c["Accreditation / Ranking"],
      avg_fees: c["Average Annual Fees (INR)"],
      url: c["URL"],
      admission_portal_url: c["AdmissionPortalURL"],
      source: c["Source"]
    }));

    const { data, error } = await supabase
      .from('unisimplify-colleges')
      .upsert(mappedColleges, { onConflict: 'university_name' });

    if (error) {
      console.error('Error seeding data:', error.message);
      console.log('\nTIP: Make sure you have a "unisimplify-colleges" table in Supabase with these columns:');
      console.log('university_name (text, primary key), tier (text), state (text), application_deadline (text), application_fee (text), proprietary_test (text), cuet_policy (text), accreditation (text), avg_fees (text), url (text), admission_portal_url (text), source (text)');
    } else {
      console.log('Successfully seeded colleges to Supabase!');
    }
  } catch (err) {
    console.error('Script failed:', err.message);
  }
}

seedColleges();
