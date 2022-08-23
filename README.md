This is a banking project and it has some functionalities like Adding money in your account, transferring money to others account and viewing transaction statements. For the sake of simplicity, you cannot create a new account. However, there are 3 ready-made accounts which can be used to test the functionality of this app -

1. name: Alex Smith, username: alex, PIN: 1111, account number - 1000000001
2. name: Emily Jones, username: emily, PIN: 2222, account number - 2000000002
3. name: Aron Williams, username: aron, PIN: 3333, account number - 3000000003

Adding money will be successful only if -

1. Amount is greater than 0

Transfer money will be successful only if -

1. Transfer is not to the same user, from alex to alex
2. Transfer amount is greater than 0
3. Amount to be transferred is less than current account balance

Additional Features

1. Refreshing the page will remove all the performed transaction. Dummy transactions which have been created in the script.js file will remain, however.
2. You can log out and log in with a different account without actually refreshing the page.
3. Transferred amount will be shown in both the accounts , that is, sender's account and recipient's account.
