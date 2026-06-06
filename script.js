 let salary = 0;
 let expenses =[];
 let myChart;
 document.addEventListener("DOMContentLoaded", ()=>{
    const savedSalary = localStorage.getItem("salary");
    const savedExpenses = localStorage.getItem("expenses");

    if(savedSalary){
      salary = Number(savedSalary);
    }
    if(savedExpenses){
        expenses= JSON.parse(savedExpenses);
    }
    updateUI();
  

  document.getElementById("setSalary").addEventListener("click" ,()=>{
    const input = document.getElementById("salaryInput").value;

    if(input==="" || input<0){
      alert("Enter Valid Salary");
      return;
    }
    salary= Number(input);
    localStorage.setItem("salary", salary);
    updateUI();
    });

   document.getElementById("addExpense").addEventListener("click", ()=>{
    const name = document.getElementById("expenseName").value.trim();
    const amount = document.getElementById("expenseAmount").value;

    if(name==="" || amount==="" || amount<0){
      alert("Enter valid Expense");
      return;
    }

    const expense = {
      name : name,
      amount : Number(amount)
    };
    expenses.push(expense);
    localStorage.setItem("expenses", JSON.stringify(expenses));   
    updateUI();
   document.getElementById("expenseName").value="";
   document.getElementById("expenseAmount").value="";
  });

document.getElementById("downloadPDF").addEventListener("click",()=>{
  console.log("PDF button clicked");
  const { jsPDF } = window.jspdf;
  const doc =  new jsPDF();
  let total=0;
  expenses.forEach(exp => total += exp.amount);
  const balance = salary - total;
  doc.text("Cash Flow Report", 10, 10);
  doc.text("Salary: " + salary, 10, 20);
  doc.text("Total Expenses: " + total, 10, 30);
  doc.text("Remaining Balance:" + balance, 10, 40);

  let y = 50;
  doc.text("Expenses: ", 10, y);
  expenses.forEach((exp, index) =>{
    y +=10;
   doc.text(`${index + 1}. ${exp.name} - ₹${exp.amount}`, 10, y);
  })
  doc.save("cashflow.pdf");
})

  function updateUI(){
    document.getElementById("salaryDisplay").innerHTML = "Salary:" + salary;
    const list = document.getElementById("expenseList");

    list.innerHTML = "";
    let total = 0;
    expenses.forEach((exp , index) =>{
      total += exp.amount;
      const li = document.createElement("li");
      li.innerHTML= `
       ${exp.name} - ₹${exp.amount}
      <button data-index="${index}">Delete</button>
    `;
    list.appendChild(li);
    });

    document.getElementById("totalExpense").innerHTML= "Total Expense:" + total;
    const balance = salary - total;
    document.getElementById("balance").innerHTML= "Remaining Balance:" + balance;

    if(balance < salary *0.1){
      document.getElementById("balance").style.color ="red";
    }
    else{
      document.getElementById("balance").style.color ="black";
    }

  const ctx = document.getElementById("myChart");
  if(myChart){
    myChart.destroy();
  }
  myChart = new Chart(ctx, {
    type : "pie",
    data:{
      labels:["Expenses", "Remaining"],
      datasets:[{
        data : [total,balance],
        backgroundColor: ["#ff6384", "#36a2eb"]
      }]
    },
     options: {
    responsive: true,
    maintainAspectRatio: false
  }
  });
}

  document.getElementById("expenseList").addEventListener("click", (e) =>{
    
    if(e.target.tagName==="BUTTON"){
      const index = e.target.getAttribute("data-index");

      expenses.splice(index,1);
      localStorage.setItem("expenses", JSON.stringify(expenses));
      updateUI();
  }

  });
});