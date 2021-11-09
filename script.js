//Chamando a function onclick
const Modal = {
    open() {
        document.querySelector('.modal-overlay').classList.add('active')
    },
    close () {
        document.querySelector('.modal-overlay').classList.remove('active')

    }
}
const Storage = {
    get() {
        return JSON.parse(localStorage.getItem("finance")) || []
    },
    set(transactions) {
        localStorage.setItem("finance", JSON.stringify(transactions))

    }
}
//SOMANDO ENTRADA E SAÍDAS
const Transaction = {
    all: Storage.get(),

    add(transaction) {
        Transaction.all.push(transaction)
        App.reload()

    },
    remove(index){
        Transaction.all.splice(index, 1)

        App.reload()

    },
    incomes(){
        let income = 0;
        Transaction.all.forEach((transaction) => {
            if (transaction.amount > 0){
                income += transaction.amount;
            }
        })
        return income;

    },
    expenses(){
        let expense = 0;
         Transaction.all.forEach((transaction) => {
            if (transaction.amount < 0) {
                expense += transaction.amount;
            }
         })
            return expense;
    },
    total(){
        return Transaction.incomes() + Transaction.expenses()
    }

}

const res = {
    transactionsContainer: document.querySelector('#data tbody'),

    addTransaction(transaction, index) {
        const tr = document.createElement('tr')
        tr.innerHTML = res.innerHTMLTransaction(transaction, index)
        tr.dataset.index = index
        res.transactionsContainer.appendChild(tr)
    },
    innerHTMLTransaction(transaction, index){
        const CssClass = transaction.amount > 0 ? "income" : "expense"
        const amount = Currency.formatCurrency(transaction.amount)
        const html =
    `   <td class='description'>${transaction.description}</td>
        <td class="${CssClass}">${amount}</td>
        <td class='date'>${transaction.date}</td>
        <td><img onclick="Transaction.remove(${index})" src="imagens/minus.svg" alt="Remover"></td>
        `
        return html
    },
    updateBalance () {
        document.querySelector('#DisplayIncomes').innerHTML= Currency.formatCurrency(Transaction.incomes())
        document.querySelector('#DisplayExpenses').innerHTML= Currency.formatCurrency(Transaction.expenses())
        document.querySelector('#DisplayTotal').innerHTML= Currency.formatCurrency(Transaction.total())
    },
    ClearTransactions () {
        res.transactionsContainer.innerHTML = ""
    }
}

const Currency = {
    formatAmount (value) {
        value = Number(value) * 100
        return value

    },

    formatDate(date){
        const splitDate = date.split("-")
        return `${splitDate[2]}/${splitDate[1]}/${splitDate[0]}`
    },

    formatCurrency(value){
        const sign = Number(value) < 0 ? "-" : ""
        value = String(value).replace(/\D/g, "")
        value = Number(value) / 100
        value = value.toLocaleString("pt-BR", {
            style:"currency",
            currency: "BRL"
    
    })
           return sign + value
    }
}
 
const Form = {
    description: document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),
    
    getValues () {
        return {
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value
        }
    },

    validateFields() {
        const {description, amount, date} = Form.getValues()

        if(description.trim() ==="" || amount.trim() ==="" || date.trim() === ""){
          throw new Error ("Preencha todos os Campos")
        }
    },
    formatValues (){
        let {description, amount, date} = Form.getValues()
        amount = Currency.formatAmount(amount)
        date = Currency.formatDate(date)
        console.log(date)

        return {
            description,
            amount,
            date
        }
    },

    saveTransaction() {
        Transaction.add(transaction)

    },

    clear(){
        Form.description.value = ""
        Form.amount.value = ""
        Form.date.value = ""
    },

    submit(event){
        event.preventDefault()
        try {
            Form.validateFields()
            const transaction = Form.formatValues()
            Transaction.add(transaction)
            Form.clear()
            Modal.close()
        } catch (error){
            alert(error.message)
        }

        
    }
}
const App = {
    init () {
        Transaction.all.forEach(res.addTransaction)
        res.updateBalance()
        Storage.set(Transaction.all)

    },

    reload () {
        res.ClearTransactions()
        App.init()

    },
}
App.init()
