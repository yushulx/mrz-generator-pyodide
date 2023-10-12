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

document_type_txt.value = 'P'
country_code_txt.value = 'UTO'
document_number_txt.value = 'L898902C3'
birth_date_txt.value = '740812'
sex_txt.value = 'F'
expiry_date_txt.value = '120415'
nationality_txt.value = 'UTO'
surname_txt.value = 'Eriksson'
given_names_txt.value = 'Anna María'
optional_data1_txt.value = 'ZE184226B'
optional_data2_txt.value = ''

let pyodide;

async function main() {
    pyodide = await loadPyodide();
    await pyodide.loadPackage("micropip");
    const micropip = pyodide.pyimport("micropip");
    await micropip.install('mrz');
    document.getElementById("loading-indicator").style.display = "none";
}
main();

function selectChanged() {

    if (dropdown.value === 'ID Card(TD1)') {
        document_type_txt.value = 'I'
        country_code_txt.value = 'ESP'
        document_number_txt.value = 'BAA000589'
        birth_date_txt.value = '800101'
        sex_txt.value = 'F'
        expiry_date_txt.value = '250101'
        nationality_txt.value = 'ESP'
        surname_txt.value = 'ESPAÑOLA ESPAÑOLA'
        given_names_txt.value = 'CARMEN'
        optional_data1_txt.value = '99999999R'
        optional_data2_txt.value = ''
    }
    else if (dropdown.value === 'ID Card(TD2)') {
        document_type_txt.value = 'I'
        country_code_txt.value = 'Utopia'
        surname_txt.value = 'ERIKSSON'
        given_names_txt.value = 'ANNA MARIA'
        document_number_txt.value = 'D23145890'
        nationality_txt.value = 'UTO'
        birth_date_txt.value = '740812'
        sex_txt.value = 'F'
        expiry_date_txt.value = '120415'
        optional_data1_txt.value = ''
        optional_data2_txt.value = ''
    }
    else if (dropdown.value == 'Passport(TD3)') {
        document_type_txt.value = 'P'
        country_code_txt.value = 'UTO'
        document_number_txt.value = 'L898902C3'
        birth_date_txt.value = '740812'
        sex_txt.value = 'F'
        expiry_date_txt.value = '120415'
        nationality_txt.value = 'UTO'
        surname_txt.value = 'Eriksson'
        given_names_txt.value = 'Anna María'
        optional_data1_txt.value = 'ZE184226B'
        optional_data2_txt.value = ''
    }
    else if (dropdown.value == 'Visa(A)') {
        document_type_txt.value = 'V'
        country_code_txt.value = 'USA'
        surname_txt.value = 'TRAVELER'
        given_names_txt.value = 'HAPPY'
        document_number_txt.value = '123456789'
        nationality_txt.value = 'CAN'
        birth_date_txt.value = '661212'
        sex_txt.value = 'M'
        expiry_date_txt.value = '140728'
        optional_data1_txt.value = 'B3XLC000FD142955'
        optional_data2_txt.value = ''
    }
    else if (dropdown.value == 'Visa(B)') {
        document_type_txt.value = 'V'
        country_code_txt.value = 'GBR'
        surname_txt.value = 'MUNIR'
        given_names_txt.value = 'FAISAL'
        document_number_txt.value = 'AD0725981'
        nationality_txt.value = 'PAK'
        birth_date_txt.value = '760815'
        sex_txt.value = 'M'
        expiry_date_txt.value = '061116'
        optional_data1_txt.value = ''
        optional_data2_txt.value = ''
    }
}

function randomize() {
    if (!pyodide) return;

    data = randomMRZData();
    surname_txt.value = data['Surname']
    given_names_txt.value = data['Given Name']
    nationality_txt.value = data['Nationality']
    country_code_txt.value = nationality_txt.value
    sex_txt.value = data['Sex']
    document_number_txt.value = data['Document Number']
    birth_date_txt.value = data['Birth Date']
    expiry_date_txt.value = data['Expiry Date']
    generate();
}

function generate() {
    if (!pyodide) return;

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
    let dataFromPython = pyodide.globals.get('txt');
    document.getElementById("outputMRZ").value = dataFromPython;
}

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

