const { GoogleGenerativeAI } = require('@google/generative-ai');
const express = require('express');
require('dotenv').config();
const bodyparser = require('body-parser');

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

async function generatecode(prompt) {
    const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-pro-latest",
        systemInstruction: "You are given with a partial C++ code. Your task is to complete the code."
    });
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    // console.log(text);
    return text;
}

async function checkcorrectness(prompt) {
    const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-pro-latest",
        systemInstruction: "You are given with a partial C++ code. Find syntax and logical errors in the code. "
    });
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    console.log(text);

    return text;
}

async function Documentation(prompt) {
    const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-pro-latest",
        systemInstruction: "You are given with a partial C++ code. Find non trivial inbuilt functions and give link to their official documentation. "
    });
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    console.log(text);

    return text;
}

// checkcorrectness("int main() {\
//     int a = 10;\
//     int b = 10;\
// }\
// ");   

const app = express();
const PORT = 3000;
app.set('view engine','ejs');
app.use(bodyparser.urlencoded({extended:true})); 


app.get('/', async (req,res) => {
    // console.log(req);
    console.log(req.query);
    console.log(Object.keys(req.query).length);
    if (Object.keys(req.query).length === 0) {
        console.log("HEREEE");
        code = null;
        result = null;
        res.render('home');
    }
    else {
        code = req.query.code;
        if (req.query.action == "Generate") {
            result = await generatecode(code);
            res.render('home', {
                code: code,
                result: result
            });
        }
        else if (req.query.action == "Debug") {
            result = await checkcorrectness(code);
            res.render('home',{
                code: code,
                result: result
            })
        }
        else if (req.query.action == "Documentation") {
            result = await Documentation(code);
            res.render('home',{
                code: code,
                result: result
            })
        }
        
    }
});
app.listen(3000);



