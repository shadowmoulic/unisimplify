const fs = require('fs');
const path = require('path');

const jsonPath = path.join(__dirname, 'web', 'src', 'data', 'colleges.json');
const csvPath1 = path.join(__dirname, 'brain', 'claude sheet.csv');
const csvPath2 = path.join(__dirname, 'brain', 'college sheet 1 perp.csv');

let colleges = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

function parseCSVLine(line) {
    const result = [];
    let curValue = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') inQuotes = !inQuotes;
        else if (char === ',' && !inQuotes) {
            result.push(curValue.trim());
            curValue = '';
        } else curValue += char;
    }
    result.push(curValue.trim());
    return result.map(v => v.replace(/^"|"$/g, ''));
}

const map = {};

function processCSV(filePath, nameCol, urlCol, portalCol) {
    const lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/).filter(line => line.trim());
    const headers = parseCSVLine(lines[0]);
    const nameIdx = headers.indexOf(nameCol);
    const urlIdx = headers.indexOf(urlCol);
    const portalIdx = headers.indexOf(portalCol);

    for (let i = 1; i < lines.length; i++) {
        const vals = parseCSVLine(lines[i]);
        if (vals.length < headers.length) continue;
        const name = vals[nameIdx];
        if (name) {
            // Find a match in the JSON array based on substring match
            const match = colleges.find(c => 
                name.toLowerCase().includes(c["University Name"].toLowerCase()) || 
                c["University Name"].toLowerCase().includes(name.toLowerCase().split('(')[0].trim())
            );
            if (match) {
                if (urlIdx !== -1 && vals[urlIdx]) match.URL = vals[urlIdx];
                if (portalIdx !== -1 && vals[portalIdx]) match.AdmissionPortalURL = vals[portalIdx];
            }
        }
    }
}

// from claude sheet
processCSV(csvPath1, 'university_name', 'url', 'admission_portal_url');
// from perp sheet
processCSV(csvPath2, 'University Name', 'URL', 'Admission Portal URL');

fs.writeFileSync(jsonPath, JSON.stringify(colleges, null, 2));
console.log('Merged URLs into colleges.json successfully');
