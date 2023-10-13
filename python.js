let dropdown = document.getElementById("dropdown");
let document_type_txt = document.getElementById("document_type_txt");
let country_code_txt = document.getElementById("country_code_txt");
let birth_date_txt = document.getElementById("birth_date_txt");
let document_number_txt = document.getElementById("document_number_txt");
let sex_txt = document.getElementById('sex_txt');
let expiry_date_txt = document.getElementById('expiry_date_txt');
let nationality_txt = document.getElementById('nationality_txt');
let surname_txt = document.getElementById('surname_txt');
let given_names_txt = document.getElementById('given_names_txt');
let optional_data1_txt = document.getElementById('optional_data1_txt');
let optional_data2_txt = document.getElementById('optional_data2_txt');

const VALID_COUNTRY_CODES = ['USA', 'CAN', 'GBR', 'AUS', 'FRA', 'CHN', 'IND', 'BRA', 'JPN', 'ZAF', 'RUS', 'MEX', 'ITA', 'ESP', 'NLD', 'SWE', 'ARG', 'BEL', 'CHE'];

function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomDate(startYear = 1900, endYear = new Date().getFullYear()) {
    let year = randomIntFromInterval(startYear, endYear);
    let month = randomIntFromInterval(1, 12);
    let day;

    if ([1, 3, 5, 7, 8, 10, 12].includes(month)) {
        day = randomIntFromInterval(1, 31);
    } else if ([4, 6, 9, 11].includes(month)) {
        day = randomIntFromInterval(1, 30);
    } else { // February
        if ((year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)) { // leap year
            day = randomIntFromInterval(1, 29);
        } else {
            day = randomIntFromInterval(1, 28);
        }
    }

    let date = new Date(year, month - 1, day);
    return date;
}

function formatDate(date) {
    return date.toISOString().slice(2, 10).replace(/-/g, "");
}

function randomString(length = 10, allowedChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ') {
    let result = '';
    for (let i = 0; i < length; i++) {
        result += allowedChars.charAt(Math.floor(Math.random() * allowedChars.length));
    }
    return result;
}

function randomMRZData() {
    let surname = randomString(randomIntFromInterval(3, 7));
    let givenName = randomString(randomIntFromInterval(3, 7));
    let nationality = VALID_COUNTRY_CODES[Math.floor(Math.random() * VALID_COUNTRY_CODES.length)];
    let sex = Math.random() < 0.5 ? 'M' : 'F';
    let documentNumber = randomString(9, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789');
    let birthDate = randomDate();
    let expiryDate = randomDate(new Date().getFullYear(), new Date().getFullYear() + 10);

    return {
        'Surname': surname,
        'Given Name': givenName,
        'Nationality': nationality,
        'Sex': sex,
        'Document Number': documentNumber,
        'Birth Date': formatDate(birthDate),
        'Expiry Date': formatDate(expiryDate)
    };
}

document_type_txt.value = 'P'

function createRandomData() {
    data = randomMRZData();
    surname_txt.value = data['Surname']
    given_names_txt.value = data['Given Name']
    nationality_txt.value = data['Nationality']
    country_code_txt.value = nationality_txt.value
    sex_txt.value = data['Sex']
    document_number_txt.value = data['Document Number']
    birth_date_txt.value = data['Birth Date']
    expiry_date_txt.value = data['Expiry Date']
}

createRandomData();


let pyodide;
let recognizer;
let dataFromPython = '';
let lines = [];
let detectedLines = [];

async function main() {
    pyodide = await loadPyodide();
    await pyodide.loadPackage("micropip");
    const micropip = pyodide.pyimport("micropip");
    await micropip.install('mrz');


    Dynamsoft.DLR.LabelRecognizer.initLicense("DLS2eyJoYW5kc2hha2VDb2RlIjoiMjAwMDAxLTE2NDk4Mjk3OTI2MzUiLCJvcmdhbml6YXRpb25JRCI6IjIwMDAwMSIsInNlc3Npb25QYXNzd29yZCI6IndTcGR6Vm05WDJrcEQ5YUoifQ==");
    recognizer = await Dynamsoft.DLR.LabelRecognizer.createInstance({
        runtimeSettings: "MRZ"
    });
    Dynamsoft.DLR.LabelRecognizer.onResourcesLoaded = (resourcesPath) => {
        document.getElementById("loading-indicator").style.display = "none";
    };
}
main();

function selectChanged() {

    if (dropdown.value === 'ID Card(TD1)') {
        document_type_txt.value = 'I'
    }
    else if (dropdown.value === 'ID Card(TD2)') {
        document_type_txt.value = 'I'
    }
    else if (dropdown.value == 'Passport(TD3)') {
        document_type_txt.value = 'P'
    }
    else if (dropdown.value == 'Visa(A)') {
        document_type_txt.value = 'V'
    }
    else if (dropdown.value == 'Visa(B)') {
        document_type_txt.value = 'V'
    }

    createRandomData();
    generate();
}

function randomize() {
    if (!pyodide) return;

    createRandomData();
    generate();
}

function generate() {
    detectedLines = [];
    document.getElementById('mrz-result').innerText = '';
    if (!pyodide) return;

    pyodide.globals.set('dropdown', dropdown.value);
    pyodide.globals.set('document_type_txt', document_type_txt.value);
    pyodide.globals.set('country_code_txt', country_code_txt.value);
    pyodide.globals.set('birth_date_txt', birth_date_txt.value);
    pyodide.globals.set('document_number_txt', document_number_txt.value);
    pyodide.globals.set('sex_txt', sex_txt.value);
    pyodide.globals.set('expiry_date_txt', expiry_date_txt.value);
    pyodide.globals.set('nationality_txt', nationality_txt.value);
    pyodide.globals.set('surname_txt', surname_txt.value);
    pyodide.globals.set('given_names_txt', given_names_txt.value);
    pyodide.globals.set('optional_data1_txt', optional_data1_txt.value);
    pyodide.globals.set('optional_data2_txt', optional_data2_txt.value);

    pyodide.runPython(`
    from mrz.generator.td1 import TD1CodeGenerator
    from mrz.generator.td2 import TD2CodeGenerator
    from mrz.generator.td3 import TD3CodeGenerator
    from mrz.generator.mrva import MRVACodeGenerator
    from mrz.generator.mrvb import MRVBCodeGenerator
    
    if dropdown == 'ID Card(TD1)':

        try:
            txt = str(TD1CodeGenerator(
                document_type_txt, country_code_txt, document_number_txt, birth_date_txt, sex_txt, expiry_date_txt, nationality_txt, surname_txt, given_names_txt, optional_data1_txt, optional_data2_txt))
        except Exception as e:
            txt = e

    elif dropdown == 'ID Card(TD2)':

        try:
            txt = str(TD2CodeGenerator(
                document_type_txt, country_code_txt, surname_txt, given_names_txt, document_number_txt, nationality_txt, birth_date_txt, sex_txt, expiry_date_txt, optional_data1_txt))
        except Exception as e:
            txt = e

    elif dropdown == 'Passport(TD3)':

        try:
            txt = str(TD3CodeGenerator(
                document_type_txt, country_code_txt, surname_txt, given_names_txt, document_number_txt, nationality_txt, birth_date_txt, sex_txt, expiry_date_txt, optional_data1_txt))
        except Exception as e:
            txt = e

    elif dropdown == 'Visa(A)':

        try:
            txt = str(MRVACodeGenerator(
                document_type_txt, country_code_txt, surname_txt, given_names_txt, document_number_txt, nationality_txt, birth_date_txt, sex_txt, expiry_date_txt, optional_data1_txt))
        except Exception as e:
            txt = e

    elif dropdown == 'Visa(B)':
        try:
            txt = str(MRVBCodeGenerator(
                document_type_txt, country_code_txt, surname_txt, given_names_txt, document_number_txt, nationality_txt, birth_date_txt, sex_txt, expiry_date_txt, optional_data1_txt))
        except Exception as e:
            txt = e
    `);
    dataFromPython = pyodide.globals.get('txt');
    document.getElementById("outputMRZ").value = dataFromPython;
    drawImage();
}

function drawImage() {
    let canvas = document.getElementById("overlay");
    let ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    var img = new Image();
    img.src = 'images/bg.jpg';

    img.onload = function () {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.fillStyle = '#FFFFFF';  // e.g., a shade of orange
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.drawImage(img, 0, 0, img.width, img.height);

        lines = dataFromPython.split('\n');
        ctx.fillStyle = "black";

        // Title
        let x = 60;
        let y = 80;
        ctx.font = '40px "Arial", monospace';
        if (dropdown.value === 'ID Card(TD1)' || dropdown.value === 'ID Card(TD2)') {
            ctx.fillText('ID Card', x, y);
        }
        else if (dropdown.value === 'Passport(TD3)') {
            ctx.fillText('Passport', x, y);
        }
        else {
            ctx.fillText('Visa', x, y);
        }

        // Info area
        let delta = 21;
        let space = 10;
        x = 400;
        y = 140;

        ctx.font = '16px "Arial", monospace';
        ctx.fillText('Type', x, y);

        y += delta;
        ctx.font = 'bold 18px "Arial", monospace';
        ctx.fillText(document_type_txt.value, x, y);

        y += delta + space;
        ctx.font = '16px "Arial", monospace';
        ctx.fillText('Surname', x, y);

        y += delta;
        ctx.font = 'bold 18px "Arial", monospace';
        ctx.fillText(surname_txt.value, x, y);

        y += delta + space;
        ctx.font = '16px "Arial", monospace';
        ctx.fillText('Given names', x, y);

        y += delta;
        ctx.font = 'bold 18px "Arial", monospace';
        ctx.fillText(given_names_txt.value, x, y);

        y += delta + space;
        ctx.font = '16px "Arial", monospace';
        ctx.fillText('Date of birth', x, y);

        y += delta;
        ctx.font = 'bold 18px "Arial", monospace';
        ctx.fillText(`${birth_date_txt.value.slice(0, 2)}/${birth_date_txt.value.slice(2, 4)}/${birth_date_txt.value.slice(4, 6)}`, x, y);

        y += delta + space;
        ctx.font = '16px "Arial", monospace';
        ctx.fillText('Sex', x, y);

        y += delta;
        ctx.font = 'bold 18px "Arial", monospace';
        ctx.fillText(sex_txt.value, x, y);

        y += delta + space;
        ctx.font = '16px "Arial", monospace';
        ctx.fillText('Date of expiry', x, y);

        y += delta;
        ctx.font = 'bold 18px "Arial", monospace';
        ctx.fillText(`${expiry_date_txt.value.slice(0, 2)}/${expiry_date_txt.value.slice(2, 4)}/${expiry_date_txt.value.slice(4, 6)}`, x, y);

        y += delta + space;
        ctx.font = '16px "Arial", monospace';
        ctx.fillText('Issuing country', x, y);

        y += delta;
        ctx.font = 'bold 18px "Arial", monospace';
        ctx.fillText(country_code_txt.value, x, y);

        x = 500
        y = 140
        ctx.font = '16px "Arial", monospace';
        if (dropdown.value === 'ID Card(TD1)' || dropdown.value === 'ID Card(TD2)') {
            ctx.fillText('Document number', x, y);
        }
        else if (dropdown.value === 'Passport(TD3)') {
            ctx.fillText('Passport number', x, y);
        }
        else {
            ctx.fillText('Visa number', x, y);
        }

        y += delta;
        ctx.font = 'bold 18px "Arial", monospace';
        ctx.fillText(document_number_txt.value, x, y);

        // MRZ area
        ctx.font = '16px "OCR-B", monospace';
        x = 60;
        y = canvas.height - 80;
        let letterSpacing = 3;
        let index = 0;
        for (text of lines) {

            let currentX = x;
            let checkLine = '';

            if (detectedLines.length > 0) {
                checkLine = detectedLines[index];
            }

            for (let i = 0; i < text.length; i++) {
                ctx.fillText(text[i], currentX, y);

                if (checkLine !== '' && checkLine[i] !== text[i]) {
                    ctx.fillRect(currentX, y + 5, ctx.measureText(text[i]).width, 2);
                }

                currentX += ctx.measureText(text[i]).width + letterSpacing;
            }
            y += 30;
            index += 1;
        }

    }
}

function recognize() {

    if (recognizer) {
        let div = document.getElementById('mrz-result');
        div.textContent = 'Recognizing...';

        recognizer.recognize(document.getElementById("overlay")).then(function (results) {
            let hasResult = false;
            for (let result of results) {
                if (result.lineResults.length !== 2 && result.lineResults.length !== 3) {
                    continue;
                }
                let output = '';
                for (let line of result.lineResults) {
                    detectedLines.push(line.text);
                    output += line.text + '\n';
                }
                div.innerText = output;
                hasResult = true;
            }
            if (!hasResult) {
                div.innerText = 'Not found';
            }
            else {
                drawImage();
            }
        });
    }
}
