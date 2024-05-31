

const fs = require('fs');

const dataDir = fs.readdirSync('./data', (err) => {
  if (err) {
    console.log(err);
  }
});
console.log (dataDir);

const dataJSON = fs.readFileSync(`./data/${dataDir[0]}`, (err) => {
  if (err) {
    console.log(err);
  }
})
// let data = JSON.parse(dataJSON)

// dataDir.forEach(element => {
//   console.log(element)
//   let dataJSON = fs.readFileSync(`./data/${dataDir[element]}`, (err) => {
//     if (err) {
//       console.log(err);
//     }
//   })
//   let data = [];
//   data.push(JSON.parse(dataJSON));
//   console.log(data);
// });


for(let i = 0; i < dataDir.length; i++){
  let dataJSON = fs.readFileSync(`./data/${dataDir[i]}`, (err) => {
    if (err) {
      console.log(err);
    }
  })
  let data = [];
  data.push(JSON.parse(dataJSON));
  console.log(data);
}

// dataDir.forEach(element => {
//   // fs.readFile(`./${dataDir}`);
//   console.log(element);
// });
// console.log(dataJSON)

