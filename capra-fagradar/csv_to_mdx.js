#!/usr/bin/env node
import fs from 'fs';

const csv_filename = process.argv[2];
const output_dir = process.argv[3];

if(!fs.existsSync(csv_filename)) {
  console.log(`Couldn't find file "${csv_filename}"`);
  process.exit(1);
}

if(!output_dir) {
  console.log("No output dir set");
  process.exit(1);
}

const data = fs.readFileSync(csv_filename, { encoding: 'utf8', flag: 'r' });

const csv_to_json = (csv_content) => {
  const lines = csv_content
    .split("\n")
    .map(line => {
      const regex = /(\"[^\"]*\"[^,]*|[^,\"]+)/g;
      return line.match(regex);
    });
  const headers = lines[0];

  return lines
    .slice(1)
    .filter(line => line !== null)
    .map(line => {
      let new_obj = {};
      headers.forEach((header, i) => {
        header = header.toLowerCase();
        if(header == 'isnew')
          header = 'is_new';

        if(typeof line[i] !== 'undefined') {
          if(line[i] === "FALSE") {
            new_obj[header] = false;
          } else if(line[i] === "TRUE") {
            new_obj[header] = true;
          } else if(line[i] === "ja") {
            new_obj[header] = true;
          } else {
            new_obj[header] = line[i];
          }
        }
      });
      return new_obj;
    });
}

const json = csv_to_json(data);

//console.log(JSON.stringify(json));

json.forEach(entry => {
  const name = entry.name
    .toLowerCase()
    .replace(' ', '-')
    .replace(' ', '-')
    .replace('&', '')
    .replace('.', '')
    .replace('/', '')
    .replace('\\', '')
    .replace('(', '')
    .replace(')', '')
    .replace('+', '')
    .replace(':', '')
    .replace('.', '')
    .replace('"', '');
  const filename = `${output_dir}/${name}.mdx`
  const data =
`---
id:
name: ${entry.name}
depth: ${entry.ring}
quadrant: ${entry.quadrant}
is_new: ${entry.is_new}
date: ${entry.date}
---

${entry.description}
`
  fs.writeFileSync(filename, data);
  console.log(`Written file ${filename}`);
});
