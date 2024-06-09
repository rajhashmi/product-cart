const mainContainer = document.querySelector(".mainContainer");
const formContainer = document.querySelector(".submitForm");
const editFormContainer = document.querySelector(".editFormContainer");

function clearInputsValue() {
  let inputs = formContainer.querySelectorAll("input");
  const input = Array.from(inputs).forEach(el => (el.value = ""));
}

function createElementWithClass(tagName, className, textContent = "") {
  const element = document.createElement(tagName);
  element.classList.add(className);
  element.innerHTML = textContent;
  return element;
}

function appendChildren(parent, ...children) {
  children.forEach((child) => parent.appendChild(child));
}

function addCard(inputBoxes, selectValue, operationType, existingCards) {
  if (operationType === "CreateNewCard") {
    const values = [];
    for (let i = 0; i < 4; i++) {
      const value = inputBoxes[i].value;
      values.push(value);
    }
    const [MRP, Price, productName, quantityProduct] = values;
    const UUIDValue = generateUUID();
    const productContainer = createElementWithClass("div", "productContainer");

    const productPrices = createElementWithClass("div", "productPrices");

    const UUID = createElementWithClass("p", "UUID", UUIDValue);
    const productMrp = createElementWithClass(
      "p",
      "productMrp",
      "MRP: " + `<span>${MRP}</span>`
    );
    const productPrice = createElementWithClass(
      "h1",
      "productPrice",
      "₹ " + `<span>${Price}</span>` + " only"
    );
    const nameAndQuantity = createElementWithClass(
      "p",
      "nameAndQuantity",
      `<span> ${productName} </span>` + `<span> ${quantityProduct} </span>` +`<span> ${selectValue} </span>`
    );

    appendChildren(
      productPrices,
      UUID,
      productMrp,
      productPrice,
      nameAndQuantity
    );

    const buttonContainer = createElementWithClass("div", "buttonContainer");

    const editButton = createElementWithClass("button", "editButton", "Edit");

    const deleteButton = createElementWithClass(
      "button",
      "deleteButton",
      "Delete"
    );

    appendChildren(buttonContainer, editButton, deleteButton);

    appendChildren(productContainer, productPrices, buttonContainer);

    document
      .querySelector(".MainContainerOfProduct")
      .appendChild(productContainer);
  } else {
  }
}

function submitValidity() {
  event.preventDefault();
  let isInputValid = true;
  const inputBoxesValue = formContainer.querySelectorAll("input");
  const selectValue = formContainer.querySelector("select").value;
  inputBoxesValue.forEach((el) => {
    if (!el.value.trim()) {
      isInputValid = false;
    }
  });
  if (isInputValid) {
    addCard(inputBoxesValue, selectValue, "CreateNewCard");
  } else {
    alert("Make Sure you Fill all the Inputs");
  }
}

function editCard() {
  const card = event.target.closest(".productContainer");
  card.id = "needChange";
  const existingInputsContianer = Array.from(card.querySelectorAll("span"));
  existingInputsContianer.pop();
  const priviousSelectValue = card.querySelector(".nameAndQuantity").lastElementChild.textContent;
  const editsInputs = editFormContainer.querySelectorAll("input");
  const editSelectValue = editFormContainer.querySelector("select");
  const options = Array.from(editFormContainer.querySelectorAll("option"));
  for (let i = 0; i < options.length; i++) {
    if (options[i].textContent === priviousSelectValue.trim()) {
      editSelectValue.options[i].selected = true;
    }
  }
  console.log(existingInputsContianer, editsInputs);
  editsInputs.forEach((el, idx) => {
    const convertInNumber = +existingInputsContianer[idx].textContent;
    if(Number.isNaN(convertInNumber)){
      el.value = existingInputsContianer[idx].textContent;
    }else{
      el.value = +existingInputsContianer[idx].textContent;

    }
  });

  editFormContainer.style.display = "block";
}

function taskController() {
  const inputvalue = event.target.innerHTML;

  switch (inputvalue) {
    case "Submit":
      submitValidity();
      clearInputsValue();
      break;
    case "Delete":
      const selectCard = event.target.closest(".productContainer");
      if (selectCard) {
        selectCard.remove();
      }
      break;
    case "Edit":
      editCard();
      break;
    case "Confirm":
      event.preventDefault();
      handleConfirmAction();
      break;
    case "X":
      handleCloseAction();
      break;
    default:
      break;
  }
}

function handleConfirmAction() {
  const inputsContainer = event.target.closest(".editFormContainer");
  const inputFields = inputsContainer.querySelectorAll("input");
  const existingCard = document.getElementById("needChange");
  const selectedValue = inputsContainer.querySelector("select").value;
  let isInputValid = true;
  inputFields.forEach((el) => {
    if (!el.value.trim()) {
      isInputValid = false;
    }
  });
  if (existingCard && isInputValid) {
    const spans = existingCard.querySelectorAll(".productPrices span");
    inputFields.forEach((input, index) => {
      spans[index].textContent = ` ${input.value} `;
    });
    existingCard.querySelector(
      ".nameAndQuantity"
    ).lastElementChild.textContent = ` ${selectedValue}`;
    inputsContainer.style.display = "none";
    existingCard.removeAttribute("id");
  } else {
    alert("Make Sure you Fill all the Inputs");
  }
}

function handleCloseAction() {
  const inputsContainer = event.target.closest(".editFormContainer");
  const existingCard = document.getElementById("needChange");
  existingCard.removeAttribute("id");
  inputsContainer.style.display = "none";
}

function generateUUID(e) {
  const time = new Date();
  const ms = time.getMilliseconds() * Math.random() * 100;
  let uuid = parseInt(ms);
  const min = 97;
  const max = 122;
  for (let i = 0; i < 10; i++) {
    const randomCharCode = Math.random() * (max - min) + min;
    uuid += String.fromCharCode(randomCharCode);
  }
  return uuid;
}

mainContainer.addEventListener("click", taskController);
