// Elements Selection
const mainContainer = document.querySelector("main"),
  heroSection = document.getElementById("hero"),
  loginFormWrapper = document.querySelector(".form-wrapper"),
  loginBtn = document.querySelector(".login-btn"),
  closeFormBtn = document.querySelector(".form .fa-xmark"),
  usernameInput = document.querySelector(".form-fields .username"),
  pinInput = document.querySelector(".form-fields .pin"),
  loginFormBtn = document.querySelector(".form .btn"),
  addMoneyForm = document.querySelector("#add-money-form"),
  addMoneyFormCloseBtn = document.querySelector("#add-money-form i"),
  addMoneyInput = document.querySelector("#add-money-form input"),
  addBtn = document.querySelector("#add-money-form .add-money-btn"),
  transferMoneyForm = document.querySelector("#transfer-money-form"),
  transferMoneyFormCloseBtn = document.querySelector("#transfer-money-form i"),
  transferMoneyToUsername = document.querySelector(".transfer-money-to"),
  transferMoneyToAccNumber = document.querySelector(".transfer-money-to-acc"),
  transferMoneyInput = document.querySelector(".transfer-money-input"),
  transferButton = document.querySelector(".transfer-money-btn");

let loginErrorDisplay = false;
let signedInUser, userIndex;
let UISection,
  transactionsWrapper,
  transactionCard,
  transactionsSection,
  netBalanceButton,
  transactionModal;

// App Main Logic

// To show transactions only once, we use a boolean variable to know if transactions are shown or not. If not, show them and if they are already shown, dont show again
let displayingTransactions = false;

let netBalance = `<div class="balance">Net Balance: <button class="btn"></button></div>`;

// transactions constructor function
const Transactions = function (amount, type, toOrFrom, date) {
  this.amount = amount;
  this.type = type;
  this.toOrFrom = toOrFrom;
  this.date = date;
};

// Dummy Users data
const user1 = {
    nameOfUser: "Alex Smith",
    accountNumber: 1000000001,
    username: "alex",
    PIN: 1111,
    transactions: [],
  },
  user2 = {
    nameOfUser: "Emily Jones",
    accountNumber: 2000000002,
    username: "emily",
    PIN: 2222,
    transactions: [],
  },
  user3 = {
    nameOfUser: "Aron Williams",
    accountNumber: 3000000003,
    username: "aron",
    PIN: 3333,
    transactions: [],
  };

const users = [user1, user2, user3];

// Adding some dummy data in the transactions array of each user. This is just to show some existing data in each array.
{
  user1.transactions.push(
    new Transactions(1000, "Add", "Self", "July 25, 2022")
  );
  user1.transactions.push(
    new Transactions(250, "Transferr", "Max Kyle", "July 25, 2022")
  );
  user1.transactions.push(
    new Transactions(300, "Receiv", "Augustus", "July 27, 2022")
  );
  user1.transactions.push(
    new Transactions(50, "Transferr", "Max Kyle", "July 28, 2022")
  );

  // User 2 transactions
  user2.transactions.push(
    new Transactions(550, "Receiv", "Julie", "July 21, 2022")
  );
  user2.transactions.push(
    new Transactions(2000, "Add", "Self", "July 21, 2022")
  );
  user2.transactions.push(
    new Transactions(100, "Transferr", "Max", "July 23, 2022")
  );
  user2.transactions.push(
    new Transactions(200, "Transferr", "Simon John", "July 25, 2022")
  );

  // User 3 transactions
  user3.transactions.push(
    new Transactions(90, "Transferr", "Elizabeth", "July 24, 2022")
  );
  user3.transactions.push(
    new Transactions(2500, "Add", "Self", "July 28, 2022")
  );
  user3.transactions.push(
    new Transactions(1000, "Transferr", "Ryan", "July 28, 2022")
  );
}

// Function for calculating account balance
const calcAccBalance = function () {
  let balance = 0;

  this.transactions.forEach((trans) => {
    if (trans.type === "Add" || trans.type === "Receiv") {
      balance += trans.amount;
    } else {
      balance -= trans.amount;
    }
  });

  return balance;
};

// A helper function which fetches right date to show in the transactions
function fetchDate() {
  const current = new Date();
  const monthsArray = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return `${
    monthsArray[current.getMonth()]
  } ${current.getDate()}, ${current.getFullYear()}`;
}

// A function for adding transaction card in the transactions wrapper
function addTransactionCards() {
  signedInUser.transactions.forEach(function (transaction) {
    let reqClass;
    if (transaction.type === "Add") {
      reqClass = "add";
    } else if (transaction.type === "Transferr") {
      reqClass = "transfer";
    } else {
      reqClass = "receive";
    }
    transactionCard = `
                <div class="trans ${reqClass}">
                    <span class="heading">${transaction.type}ed $${transaction.amount}</span>
                    <span class="to-or-from">To/From: ${transaction.toOrFrom}</span>
                    <span class="date">Date: ${transaction.date} </span>
                </div>
    `;

    transactionsWrapper.insertAdjacentHTML("afterbegin", transactionCard);
  });

  transactionsWrapper.insertAdjacentHTML("beforeend", netBalance);
  netBalanceButton = document.querySelector(".balance .btn");
}

// Function for displaying transactions
const showTransactionsHandler = () => {
  transactionsSection.classList.toggle("hidden");

  transactionsWrapper.innerHTML = "";
  addTransactionCards();
  netBalanceButton.innerText = `$${calcAccBalance.call(users[userIndex])}`;
};

//Function for showing adding Money form
const showAddMoneyForm = function () {
  addMoneyForm.classList.add("show");

  addMoneyFormCloseBtn.addEventListener("click", function () {
    addMoneyForm.classList.remove("show");
  });
};

// Function for adding money
const addButtonClickHandler = function (e) {
  e.preventDefault();

  const enteredAmount = +addMoneyInput.value;

  if (!enteredAmount || enteredAmount < 0) {
    alert("Please Enter Valid amount");
    addMoneyInput.value = "";

    return;
  } else {
    users[userIndex].transactions.push(
      new Transactions(enteredAmount, "Add", "Self", fetchDate())
    );

    // Here, we are removing all the previous content inside the transaction wrapper and adding the fresh content.
    transactionsWrapper.innerHTML = "";
    addTransactionCards();

    netBalanceButton.innerText = `$${calcAccBalance.call(users[userIndex])}`;

    addMoneyForm.classList.remove("show");
    addMoneyInput.value = "";
    addMoneyFormCloseBtn.click();

    transactionModal.classList.add("show");

    setTimeout(() => {
      transactionModal.classList.remove("show");
    }, 2000);

    return;
  }
};

// Function for displaying the transfer money form
const showTransferMoneyForm = function () {
  transferMoneyForm.classList.add("show");

  transferMoneyFormCloseBtn.addEventListener("click", function () {
    transferMoneyForm.classList.remove("show");
  });
};

// Function for transferring money from one account to another
const transferButtonClickHandler = function (e) {
  e.preventDefault();

  const enteredUsername = transferMoneyToUsername.value,
    enteredAmount = +transferMoneyInput.value;

  const currentAccBalance = calcAccBalance.call(users[userIndex]);
  const reqRecipient = users.find((user) => user.username === enteredUsername);

  if (
    enteredAmount > currentAccBalance ||
    enteredAmount <= 0 ||
    !reqRecipient ||
    reqRecipient.username === users[userIndex].username
  ) {
    alert(
      "Transaction Failed. Either your account has insufficient balance or the details entered are incorrect."
    );
    transferMoneyToUsername.value = "";
    transferMoneyToAccNumber.value = "";
    transferMoneyInput.value = "";

    return;
  } else {
    reqRecipient.transactions.push(
      new Transactions(
        +enteredAmount,
        "Receiv",
        users[userIndex].nameOfUser,
        fetchDate()
      )
    );

    users[userIndex].transactions.push(
      new Transactions(
        +enteredAmount,
        "Transferr",
        reqRecipient.nameOfUser,
        fetchDate()
      )
    );

    // Here, we are removing all the previous content inside the transaction wrapper and adding the fresh content.
    transactionsWrapper.innerHTML = "";
    addTransactionCards();

    netBalanceButton.innerText = `$${calcAccBalance.call(users[userIndex])}`;

    (transferMoneyToUsername.value = ""),
      (transferMoneyToAccNumber.value = ""),
      (transferMoneyInput.value = "");
    transferMoneyFormCloseBtn.click();

    transactionModal.classList.add("show");

    setTimeout(() => {
      transactionModal.classList.remove("show");
    }, 2000);

    return;
  }
};

const logOutHandler = function () {
  signedInUser = "";
  userIndex = "";

  UISection.classList.add("hidden");
  transactionsSection.classList.add("hidden");
  heroSection.classList.remove("hidden");
};

// Event Handlers
loginBtn.addEventListener("click", () => {
  loginFormWrapper.classList.add("show");
});

closeFormBtn.addEventListener("click", () => {
  loginFormWrapper.classList.remove("show");
});

loginFormBtn.addEventListener("click", function (e) {
  e.preventDefault();

  let enteredUsername = usernameInput.value;
  let enteredPIN = pinInput.value;

  const [result] = users.filter((user) => {
    return user.username == enteredUsername && user.PIN == enteredPIN;
  });

  signedInUser = result;
  userIndex = users.findIndex((user) => user.username === enteredUsername);

  if (!result) {
    const loginErrorMsg = `
        <div class='login-error'>
            <i class="fa-solid fa-triangle-exclamation"></i> Login Failed. Please enter correct credentials.
        </div>
    `;

    if (!loginErrorDisplay) {
      pinInput.insertAdjacentHTML("afterend", loginErrorMsg);
    }
    loginErrorDisplay = true;
  } else {
    const userInterface = `
    <div class="successful-modal">
        <h1 class="modal-heading">Transaction Successfull</h1>
        <img src="images/done.jpg" alt="Done Logo" />
    </div>

    <section class="UI section" id="UI">
        <div class="image-wrapper">
          <img src="images/user-banner.png" alt="User Image" />
        </div>

        <div class="text-wrapper">
          <h1 class="hero-heading">Welcome Back, ${result.nameOfUser}</h1>
          <p class="hero-text">What would you like to do today?</p>

          <div class="button-wrapper">
            <button class="btn transfer-money">
              <i class="fa-solid fa-money-bill-transfer"></i>Transfer Money
            </button>
            <button class="btn add-money">
              <i class="fa-solid fa-coins"></i>Add Money
            </button>
            <button class="btn show-transaction">
              <i class="fa-solid fa-clipboard-list"></i>View Transactions
            </button>
            <button class="btn log-out">
              <i class="fa-solid fa-right-from-bracket"></i>Log Out
            </button>
          </div>
        </div>
      </section>

      <section class="section transactions hidden" id="transactions">
              <h1 class="section-heading">Latest Transactions</h1>
                
              <div class="transactions-wrapper">
              </div>
        </section>
`;

    closeFormBtn.click();
    heroSection.classList.add("hidden");
    mainContainer.insertAdjacentHTML("afterbegin", userInterface);

    UISection = document.getElementById("UI");
    transactionsSection = document.getElementById("transactions");
    transactionsWrapper = document.querySelector(
      "#transactions .transactions-wrapper"
    );
    transactionModal = document.querySelector(".successful-modal");

    usernameInput.value = "";
    pinInput.value = "";

    // Selecting the operations button for each user.
    const showTransactionsBtn = document.querySelector(".show-transaction");
    const moneyTransferBtn = document.querySelector(
      ".UI .button-wrapper .transfer-money"
    );
    const addMoneyBtn = document.querySelector(".add-money");
    const logOutBtn = document.querySelector(".log-out");

    // Attaching event listeners on the three operations button. Handler functions have created outside this function.
    showTransactionsBtn.addEventListener("click", showTransactionsHandler);
    moneyTransferBtn.addEventListener("click", showTransferMoneyForm);
    addMoneyBtn.addEventListener("click", showAddMoneyForm);
    logOutBtn.addEventListener("click", logOutHandler);
  }
});

transferButton.addEventListener("click", transferButtonClickHandler);
addBtn.addEventListener("click", addButtonClickHandler);
