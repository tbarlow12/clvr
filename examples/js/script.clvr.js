const clvr = require("clvr").default;

const fileName = "file.txt";
const fileContent = JSON.stringify({name: "Clover"});

clvr({
  name: "Set Service Principal",
  validations: [
    {
      command: `sh ../../../scripts/writeFile.sh ${fileName} ${fileContent}`,
      files: {
        "file.txt": {
          shouldExist: true,
          shouldContain: [
            fileContent
          ]
        }
      }
    },
    {
      command: `sh ../../../scripts/deleteFile.sh ${fileName}`,
      files: {
        "file.txt": {
          shouldExist: false,
        }
      }
    },
  ]
});