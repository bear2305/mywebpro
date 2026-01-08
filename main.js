

// 1. Temporary Data Structure
const transactions = {};
let currentTransactionType = true; 

// 2. Select Elements
const formOverlay = document.getElementById('formOverlay');
const transForm = document.getElementById('transactionForm');
const historyBox = document.getElementById('historyContainer');

// UI Buttons
document.getElementById('btnIn').onclick = () => {
    currentTransactionType = true;
    document.getElementById('formTitle').innerText = "Cash In";
    document.getElementById('header').style.backgroundColor = "rgb(41, 164, 39)";
    formOverlay.style.display = 'block';
};

document.getElementById('btnOut').onclick = () => {
    currentTransactionType = false;
    document.getElementById('formTitle').innerText = "Cash Out";
    document.getElementById('header').style.backgroundColor = "rgb(250, 75, 75)";
    formOverlay.style.display = 'block';
};

document.getElementById('cancelBtn').onclick = () => {
    formOverlay.style.display = 'none';
};

// 3. Handle Form Submission
transForm.onsubmit = function(e) {
    e.preventDefault();

    const amount = parseFloat(document.getElementById('cash').value);
    const note = document.getElementById('note').value;
    const dateVal = document.getElementById('prefferedDate').value;
    const timeVal = document.getElementById('prefferedTime').value;

    const dateParts = dateVal.split("-");
    const y = dateParts[0];
    const m = parseInt(dateParts[1]);
    const d = parseInt(dateParts[2]);

    // Build Nested Dictionary
    if (!transactions[y]) { transactions[y] = {}; }
    if (!transactions[y][m]) { transactions[y][m] = {}; }
    if (!transactions[y][m][d]) { transactions[y][m][d] = []; }

    transactions[y][m][d].push({
        amount: amount,
        isPositive: currentTransactionType,
        note: note,
        time: timeVal
    });

    updateUI();
    formOverlay.style.display = 'none';
    transForm.reset();
};

// 4. Update Table and History
function updateUI() {
    let tIn = 0;
    let tOut = 0;
    historyBox.innerHTML = "";

    for (let y in transactions) {
        for (let m in transactions[y]) {
            for (let d in transactions[y][m]) {
                let list = transactions[y][m][d];
                
                for (let i = 0; i < list.length; i++) {
                    let item = list[i];

                    // Calculate Totals
                    if (item.isPositive === true) {
                        tIn = tIn + item.amount;
                    } else {
                        tOut = tOut + item.amount;
                    }

                    // Build History HTML
                    let div = document.createElement('div');
                    div.style.padding = "10px";
                    div.style.borderBottom = "1px solid #ccc";
                    
                    let color = item.isPositive ? "green" : "red";
                    let sign = item.isPositive ? "+" : "-";

                    div.innerHTML = `
                        <b style="color:${color}">${sign} $${item.amount}</b> 
                        | ${item.note} | <small>${y}-${m}-${d} ${item.time}</small>
                    `;
                    historyBox.appendChild(div);
                }
            }
        }
    }

    // Update the Table
    document.getElementById('totalIn').innerText = tIn;
    document.getElementById('totalOut').innerText = tOut;
    document.getElementById('balance').innerText = tIn - tOut;
}