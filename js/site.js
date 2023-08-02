// get values
function getValues() {
    // get user values from entry point
    let loanAmount = document.getElementById('loanAmount').value;
    let totalMonths = document.getElementById('totalMonths').value;
    let interestRate = document.getElementById('interestRate').value;

    // input validation for integers
    loanAmount = Number(loanAmount);
    totalMonths = Number(totalMonths);
    interestRate = Number(interestRate);

    // loop to check if input numbers are actual numbers
    if (isNaN(loanAmount) == true || isNaN(totalMonths) == true || isNaN(interestRate) == true) {
        Swal.fire({
            title: 'Oops!',
            text: 'Unfortunately, SMART MONEY only works with numbers',
            icon: 'error',
            backdrop: false
        });

    } else {
        // assign array to calculation function
        let loanPayment = calculateMortgage(loanAmount, totalMonths, interestRate);

        // display the data if everything is ok
        displayData(loanPayment);
        displayTotals(loanAmount, loanPayment);
    }
}

// calculate mortgage
function calculateMortgage(loanAmount, totalMonths, interestRate) {

    // state calculation items
    let loanArray = [];
    let totalInterest = 0;
    let balanceRemaining = loanAmount

    // total monthly payment
    monthlyPayment = (loanAmount) * (interestRate / 1200) / (1 - (1 + interestRate / 1200) ** (-totalMonths));

    for (let month = 1; month <= totalMonths; month++) {

        // principal payment
        let monthlyPrincipal = monthlyPayment - monthlyInterest;

        // interest payment
        let monthlyInterest = balanceRemaining * interestRate / 1200;

        // accumulated total interest
        totalInterest += monthlyInterest;

        // remaining balance for next month
        balanceRemaining = balanceRemaining + monthlyInterest - monthlyPayment
        if (balanceRemaining <= 0){
            balanceRemaining = 0;
        }

        let newPayment = {
            month: month,
            payment: monthlyPayment,
            principal: monthlyPrincipal,
            monthlyInterest: monthlyInterest,
            totalInterest: totalInterest,
            balance: balanceRemaining,
        }

        loanArray.push(newPayment);
    }
    return loanArray;
}


// display data
function displayData(loanPayment) {

    // find the table on the page
    const loanTable = document.getElementById('loan-table');

    // find the table row template
    const loanTemplate = document.getElementById('loan-table-template');

    //clear out the table
    loanTable.innerHTML = '';

    //for each month:
    for (let index = 0; index < loanPayment.length; index += 1) {
        // -- get one month
        let month = loanPayment[index];

        // -- clone the template
        let tableRow = loanTemplate.content.cloneNode(true);

        // -- get each property of event
        // -- insert each property into the cloned template
        tableRow.querySelector('[data-id="month"]').innerText = month.month;
        tableRow.querySelector('[data-id="payment"]').innerText = month.payment.toLocaleString();
        tableRow.querySelector('[data-id="principal"]').innerText = month.principal.toLocaleString();
        tableRow.querySelector('[data-id="interest"]').innerText = month.interest.toLocaleString();
        tableRow.querySelector('[data-id="totalInterest"]').innerText = month.totalInterest.toLocaleString();
        tableRow.querySelector('[data-id="balance"]').innerText = month.balance.toLocaleString();

        // -- insert the event data into table
        loanTable.appendChild(tableRow);
    }
}

// display totals
function displayTotals(loanAmount, loanPayment) {


    document.getElementById('monthlyPayment').innerHTML = loanPayment[0].toLocaleString();
    document.getElementById('totalPrincipal').innerHTML = loanAmount.toLocaleString();
    document.getElementById('totalInterest').innerHTML = loanPayment[loanPayment.length-1].totalInterest.toLocaleString();
    document.getElementById('totalCost').innerHTML = (loanAmount + loanPayment[loanPayment.length-1].totalInterest).toLocaleString();

}




