const fs = require('fs');
const path = require('path');

const csvPath = path.join(__dirname, 'brain', '2025-2026 Private Indian University Admissions Unified Database - Table 1.csv');
const outputPath = path.join(__dirname, 'web', 'src', 'data', 'colleges.json');

function parseCSVLine(line) {
    const result = [];
    let curValue = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            result.push(curValue.trim());
            curValue = '';
        } else {
            curValue += char;
        }
    }
    result.push(curValue.trim());
    return result;
}

try {
    const csvData = fs.readFileSync(csvPath, 'utf8');
    const lines = csvData.split(/\r?\n/).filter(line => line.trim());
    const headers = parseCSVLine(lines[0]);
    const result = [];

    for (let i = 1; i < lines.length; i++) {
        const values = parseCSVLine(lines[i]);
        if (values.length < headers.length) continue;

        const obj = {};
        headers.forEach((header, index) => {
            let val = values[index] || '';
            // Remove wrapping quotes if any
            if (val.startsWith('"') && val.endsWith('"')) {
                val = val.substring(1, val.length - 1);
            }
            obj[header] = val;
        });
        result.push(obj);
    }
    
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));
    console.log('Successfully converted CSV to JSON with improved parsing');
} catch (err) {
    console.error('Error:', err);
}
