const fs = require('fs');
const readFile = (...args) => {
    return new Promise((resolve, reject) => {
        fs.readFile(...args, (err, data) => {
            if (err) {
                return reject(err);
            }
            resolve(data);
        });
    });
}

const googleCreds = require('./google-creds.json')
// Imports the Google Cloud client library
const { Translate } = require('@google-cloud/translate').v2;

// Creates a client
const translate = new Translate({
    credentials: googleCreds
});

const text = 'Hello, world!';
const target = 'ja';

async function translateText(text, target) {
    // Translates the text into the target language. "text" can be a string for
    // translating a single piece of text, or an array of strings for translating
    // multiple texts.
    let [translations] = await translate.translate(text, target);
    translations = Array.isArray(translations) ? translations : [translations];
    console.log('Translations:');
    translations.forEach((translation, i) => {
        console.log(`${text[i]} => (${target}) ${translation}`);
    });
}

const combineKeysAndValues = (keys, values) => {
    let object = {};
    for (let i = 0; i < keys.length; i++) {
        if (keys[i]) {

            object[keys[i]] = values[i];
        } else {
            object["index"] = value[i];
        }

    }
    return object;
}



(async () => {
    const expensesInJapanese = await readFile('./test.csv', 'utf8').catch(err => console.log(err));
    const rowTitlesInJapanese = expensesInJapanese.split('\n')[0];
    const rowTilesInEnglish = ["Index", "Transaction Date", "Debit Account Title", "Debit Amount", "Debit Tax Classification", "Debit Item", "Debit Department", "Debit Note", "Credit Account Title", "Credit Amount", "Credit Tax Classification", "Credit Item", "Credit Department", "Credit Note", "Vendors", "Remark", "Adjustment Journal Entry", "Credit Vendors", "Debit Vendors", "Archival Number", "Date Written", "Debit Account Title Code", "Credit Account Title Code", "Update Date", "Approval Status","Approved By","Approved Date", "Created By"];
    const valueSets = expensesInJapanese.split('\n').splice(1, expensesInJapanese.length - 1).map(expense => {
        return expense.replace(/"/g, '').split(',');
    });
    const expensesToBeTranslated = valueSets.map(set => combineKeysAndValues(rowTilesInEnglish, set));
    console.log(expensesToBeTranslated);

})()