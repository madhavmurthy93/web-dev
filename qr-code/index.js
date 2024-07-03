/* 
1. Use the inquirer npm package to get user input.
2. Use the qr-image npm package to turn the user entered URL into a QR code image.
3. Create a txt file to save the user input using the native fs node module.
*/
import inquirer from "inquirer";
import qr from "qr-image";
import fs from "fs";

console.log("QR code generator");

let urlQuestion = {
    type: "input",
    name: "url",
    message: "Enter a URL."
}
inquirer
    .prompt([urlQuestion])
    .then((answers) => {
        // generate QR code
        console.log("Generating QR code for", answers.url);
        let qrSvg = qr.image(answers.url, { type: "svg" })
        qrSvg.pipe(fs.createWriteStream("qr-code.svg"));
        console.log("QR code generated at qr-code.svg");
        fs.writeFile("input.txt", answers.url, (error) => {
            if (error) {
                console.log("Sorry, couldn't write  url to input.txt", error);
            }
        });

    })
    .catch((error) => {
        console.log("Sorry, there was an error generating your QR code", error);
    });