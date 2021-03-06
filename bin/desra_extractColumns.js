/**
 * Created by yangm11 on 11/6/2017.
 */
'use strict';

const fs = require('fs');
const readline = require('readline');

function extracCols(path, delemeter, indexArr) {
  let ws = fs.createWriteStream(path+'.tsv');
  let rl = readline.createInterface({
    input: fs.createReadStream(path)
  });

  let rows = 0;

  rl.on('line', line => {
    if (line[0] !== '#') {
      line = line.trim();
      let cols = line.split(delemeter).filter(d => d.length);
      if (cols[2] === 'gene') {
        rows += 1;
        let c = [];
        for (let i = 0; i < indexArr.length; i++) {
          c.push(cols[indexArr[i]]);
        }
        // console.log(cols);
        let re = /GeneID:(\d+)[,;]/g;
        let re1 = /gene=(\w+)/g;
        let gid = re.exec(cols[cols.length -1]);
        let gn = re1.exec(cols[cols.length -1]);
        if (gid) {
          c.push(gid[1]);
          c.push(gn[1]);
          // console.log(c);
          ws.write(c.join('\t') + '\n');
        }
      }
    }
  }).on('close', () => {
    console.log('Done extracting!');
    console.log(rows + ' lines are written!');
  });
}


if (typeof module !== 'undefined' && module.parent) {

} else {
  // test code go here
  let p = process.argv[2];
  let d = process.argv[3];
  let idx = process.argv.slice(4).map(d => +d);
  console.log(p, d, idx);
  // extracCols(p, d, idx);
  extracCols(p, '\t', [0, 3, 4]);
}