// get the numbers for the loan out of the inputs
function getValues() {
    // get each of the values from the inputs on the page
    let loanAmount = document.getElementById('loanAmount').value;
    let loanLength = document.getElementById('totalTerm').value;
    let loanInterest = document.getElementById('interestRate').value;

    loanAmount = parseFloat(loanAmount);
    loanLength = parseInt(loanLength);
    loanInterest = parseFloat(loanInterest);

    // make sure those values make sense
    if(isNaN(loanAmount) || isNaN(loanLength) || isNaN(loanInterest)
            || loanAmount <= 0 || loanLength <= 0 || loanInterest <= 0) {
        Swal.fire({
            icon: 'error',
            title: 'OOPS!',
            text: 'Please enter valid loan details.'
        })

    } else {
        //  do something with those inputs
        let loanTotals = calculateTotals(loanAmount, loanLength, loanInterest);

        displayTotals(loanTotals.monthlyPayment, 
                      loanAmount,
                      loanTotals.totalInterest, 
                      loanTotals.totalCost);

        let payments = calculatePayments(loanLength, loanTotals.monthlyPayment, loanAmount, loanInterest);

        displayPayments(payments);
    }
}

// calculate the totals for the loan
function calculateTotals(principal, term, rate) {
    // calculate the monthly payment
    let monthlyPayment = (principal * (rate / 1200)) / (1 - Math.pow((1 + rate/1200), -term) );

    // calculate the total cost
    let totalCost = monthlyPayment * term;

    // calculate the total interest
    let totalInterest = totalCost - principal;

    let loanTotals = {
        monthlyPayment: monthlyPayment,
        totalCost: totalCost,
        totalInterest: totalInterest,
    };

    return loanTotals;
}

// display the totals for the loan
function displayTotals(monthlyPayment, principal, interest, cost) {
    let formatOptions = {
        style: 'currency',
        currency: 'USD'
    };

    document.getElementById('monthlyPayment').textContent = monthlyPayment.toLocaleString('en-US', formatOptions);

    document.getElementById('totalPrincipal').textContent = principal.toLocaleString('en-US', formatOptions);

    document.getElementById('totalInterest').textContent = interest.toLocaleString('en-US', formatOptions);

    document.getElementById('totalCost').textContent = cost.toLocaleString('en-US', formatOptions);

}

// calculate each month of payments in the table
function calculatePayments(term, monthlyPayment, principal, rate) {
    // create for loop to calculate every month of payments

    let remainingBalance = principal;
    let totalInterest = 0;
    let paymentsArray = [];

    for(let month = 1; month <= term; month += 1) {

        // -- calculate each column of my table
        let interestPayment = remainingBalance * rate / 1200;

        let principalPayment = monthlyPayment - interestPayment;

        totalInterest += interestPayment;

        remainingBalance -= principalPayment;

        // -- create an object to store those values
        let loanPayment = {
            month: month,
            payment: monthlyPayment,
            principal: principalPayment,
            interest: interestPayment,
            totalInterest: totalInterest,
            balance: remainingBalance
        };
        // -- put that object in an array
        paymentsArray.push(loanPayment);
    }
    // return that array
    return paymentsArray;
}

// display each month of payments in the table
function displayPayments(payments) {
    let formatOptions = {
        style: 'currency',
        currency: 'USD'
    };

    const tableRowTemplate = document.getElementById('payment-row'); // the <template> element with one <tr> inside
    const paymentsTable = document.getElementById('loan-table'); // the <tbody> element

    paymentsTable.innerHTML = ''; // empty out the table contents before making new table rows

    for(let i = 0; i < payments.length; i++) {

        let currentPayment = payments[i];

        let tableRow = tableRowTemplate.content.cloneNode(true); // copy the <tr> element from the <template>

        let tableCells = tableRow.querySelectorAll('td'); // gets ALL the <td> elements inside the <tr>

        // assign the content of each <td> to the properties of our object
        tableCells[0].textContent = currentPayment.month.toLocaleString('en-US');
        tableCells[1].textContent = currentPayment.payment.toLocaleString('en-US', formatOptions);
        tableCells[2].textContent = currentPayment.principal.toLocaleString('en-US', formatOptions);
        tableCells[3].textContent = currentPayment.interest.toLocaleString('en-US', formatOptions);
        tableCells[4].textContent = currentPayment.totalInterest.toLocaleString('en-US', formatOptions);
        tableCells[5].textContent = Math.abs(currentPayment.balance).toLocaleString('en-US', formatOptions);

        if (i == payments.length -1) {
            tableRow.querySelector('tr').classList.add('table-success');
        }

        // put the <tr> in the <tbody>
        paymentsTable.appendChild(tableRow);
    }

}




