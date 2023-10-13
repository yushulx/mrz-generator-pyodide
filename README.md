# MRZ Generator in Python and HTML5
The project demonstrates how to build an online MRZ generator app with [Python MRZ package](https://pypi.org/project/mrz/), [Pyodide](https://pyodide.org/en/stable/index.html) and HTML5. It also integrates [Dynamsoft Label Recognizer](https://www.npmjs.com/package/dynamsoft-label-recognizer) for MRZ recognition. A [valid license key](https://www.dynamsoft.com/customer/license/trialLicense?product=dlr&source=codepool) is required for the JavaScript MRZ detection SDK.

## How to Run the App
1. Set the license key in `python.js`:
    
    ```javascript
    Dynamsoft.DLR.LabelRecognizer.initLicense("LICENSE-KEY");
    ```

2. Run the app:

    ```bash
    python -m http.server
    ```
    ![online mrz generator](https://github.com/yushulx/mrz-generator-pyodide/assets/2202306/61c74bfe-9d0c-43b3-9072-ff32e38f0ae3)




## Try Online MRZ Generator
https://yushulx.me/mrz-generator-pyodide/
