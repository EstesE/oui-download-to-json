let file_name = 'oui.txt';
let cleanName = file_name.replace('.txt', '');
let fs = require('fs');
let json = {};
let count = 1;
let hex = '';
let org = '';
let name = '';
let base16 = '';
let address = {
  line1: '',
  line2: '',
  line3: ''
};

json[cleanName] = [];

function processFile() {
  let readline = require('readline');
  let fs = require('fs');
  let lineReader = readline.createInterface({
      input: fs.createReadStream(file_name)
  });

  let mainLine = 0;
  lineReader.on('line', function (line) {
    mainLine++;
    if(mainLine > 4) {
      if (count ===1) {
        let line1 = line.split('');

        for (let i = 0; i <= 16; i++) {
          hex = hex + line1[i];
        }
        hex = hex.replace('(hex)', '').trim();

        for (let i = 17; i <= line1.length - 1; i++) {
          org = org + line1[i];
        }
        org = org.trim();      
      }

      if (count === 2) {
        let line2 = line.split('');

        for (let i = 0; i <= 20; i++) {
          base16 = base16 + line2[i];
        }
        base16 = base16.replace('(base 16)', '').trim();

        for (let i = 21; i <= line2.length - 1; i++) {
          name = name + line2[i];
        }
        name = name.trim(); 
      }

      if (count === 3) {
        address.line1 = line.trim();;
      }

      if (count === 4) {
        address.line2 = line.trim();;
      }

      if (count === 5) {
        address.line3 = line.trim();
      }

      if (line === "") {
        var myObj = new Object({
          hex: hex,
          organization: org,
          name: name,
          base16: base16,
          address: address
        });

        json[cleanName].push(myObj);

        hex = '';
        org = '';
        name = '';
        base16 = '';
        address = {
          line1: '',
          line2: '',
          line3: ''
        };
    
        count = 1;
      } else {
        count++;
      }
    }
  });

  lineReader.on('close', function () {
      fs.writeFileSync(cleanName + '.json', JSON.stringify(json,null,2));
  });
}

let https = require('https');
let download = function(url, dest, cb) {
  let file = fs.createWriteStream(dest);
  let request = https.get(url, function(response) {
    response.pipe(file);
    file.on('finish', () => {
      file.close(cb);
    });
    file.on('close', () => {
      processFile();
    });
    file.on('error', (error) => {
      console.log('Errorz: ' + error);
    });
  });
}

fs.unlink('oui.txt', (err) => {
  if (err) {
    console.log(err);
    console.log('File not found?');
  }

  // http://standards.ieee.org/develop/regauth/oui/oui.txt
  download('https://linuxnet.ca/ieee/oui.txt', 'oui.txt', function() {
    console.log('finished');
  });
});
