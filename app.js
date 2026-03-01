const express = require("express");
const { setWebhook } = require("./setWebhook");

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("hello");
});

app.post("/calculator", (req, res) => {
  const { id, first_name, username } = req.body.message.chat;
  const { text } = req.body.message;

  console.log(req.body);

  const OPERATORS = ["+", "-", "*", "/"];
  let result = 0;
  let error;
  let operators = [];
  let numbers = [];
  let tempNum = "";

  //remove all spaces
  const trimRequest = text.trim();

  if (trimRequest.length === 0) {
    error = "incomplete expression: ";
  } else {
    //separate numbers and operators
    for (let i = 0; i < trimRequest.length; i++) {
      const r = trimRequest[i];

      if (parseFloat(r) || r === "0" || r === ".") {
        tempNum += r;
        if (i === trimRequest.length - 1) numbers.push(tempNum);
      } else {
        operators.push(r);
        tempNum !== "" && numbers.push(tempNum);
        tempNum = "";
      }
    }

    //e.g. request="15"
    if (operators.length === 0 && numbers.length > 0) {
      result = `${text} = ${text}`;
    }
    //e.g. request="2+"
    else if (operators.length > 0 && numbers.length <= 1) {
      error = `incomplete expression: ${text}`;
    } else {
      // console.log(operators);
      // console.log(numbers);

      for (let i = 0; i < operators.length; i++) {
        const operator = operators[i];
        const num1 = parseFloat(numbers[i]);
        const num2 = parseFloat(numbers[i + 1]);

        //if request operator doesn't include in [+, -, *, /]
        if (!OPERATORS.includes(operator)) {
          error = `incomplete expression: ${text}`;
          break;
        }

        //multiply first, if there's '*' in operators
        if (operator === "*") {
          result = num1 * num2;

          numbers.splice(i, 2);
          numbers.splice(i, 0, result);

          operators.splice(i, 1);
          !operators.includes("*") ? (i = -1) : i--;
        }
        //if there's no more '*', do division next if there's '/'
        else if (!operators.includes("*") && operator === "/") {
          if (num2 === 0) {
            error = [
              `division by zero = ${request}`,
              ` ${request} = division by zero`,
              "division by zero",
            ];
            break;
          }

          result = num1 / num2;

          numbers.splice(i, 2);
          numbers.splice(i, 0, result);

          operators.splice(i, 1);
          !operators.includes("/") ? (i = -1) : i--;
        }
        //if there's no more '*' and '/' in operators, do + and -
        else if (operators.every((o) => !["*", "/"].includes(o))) {
          switch (operator) {
            case "+":
              result = num1 + num2;
              break;
            case "-":
              result = num1 - num2;
              break;
          }

          numbers.splice(i, 2);
          numbers.splice(i, 0, result);

          operators.splice(i, 1);
          i--;
        }

        // console.log(`operator ${operator}: ${numbers}`);
      }

      result = result.toLocaleString();

      // result = [`${result} = ${text}`, `${text} = ${result}`, `${result}`];
    }
  }

  // res.status(error ? 400 : 200).send({
  //   res: error || result,
  // });

  fetch(
    "https://api.telegram.org/bot8765110803:AAG7OGGxjQt2tqcGSZ1uydxoVI9RGQeG7qQ/sendMessage",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: id,
        text: error || result,
      }),
    },
  );

  return res.send();
});

app.listen(3000, () => {
  setWebhook();
  console.log("Server started!");
});
