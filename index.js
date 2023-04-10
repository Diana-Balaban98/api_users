const express = require('express');
const formData = require('express-form-data');
const generator = require('node-unique-id-generator');
const dotenv = require('dotenv');
dotenv.config();


const users = [
    { id: 1, name: "Pasha", isMan: true, age: 25 },
];

class User {
    constructor(name, isMan, age) {
        this.id = generator.generateUniqueId();
        this.name = name;
        this.isMan = isMan;
        this.age = age;
    }
}

users.push(new User("Diana", false, 25));
users.push(new User("Alexei", true, 37));
users.push(new User("Julia", false, 29));


const app = express();
app.use(formData.parse());

const sendRes = (num, text, res) => {
    res
       .status(num)
       .json(text);
}


app.get("/users", (req, res) => {
    res.json(users);
});


app.get("/users/:gender", (req, res) => {
    const { gender } = req.params;
 
    switch (gender) {
        case "M":
            const men = users.filter(el => el.isMan);
            res.json(men)
            break;
         case "F":
            const women = users.filter(el => !el.isMan);
            res.json(women);
            break;
        default:
            sendRes(400, "Неправильный запрос", res);
    }
});


app.get("/filtredUsers", (req, res) => {
    const { min, max } = req.query;

    if (min > 0 && max <= 100) {
        const find = users.filter(el => el.age >= min && el.age <= max);
        find.length === 0? res.json("Не найдено пользователей, попадающих под диапазон возраста") : res.json(find);
         
    } else {
        sendRes(400, "Превышен диапазон возраста для получения пользователей", res);
    }
})


app.post("/user", (req, res) => {
    if (Object.keys(req.body).length !== 0) {

    const { name, isMan, age } = req.body;

    !(name && isMan && age) ?  sendRes(400, "Заполните нужные поля", res) : users.push(new User(name, isMan, age)) &&  sendRes(201, req.body, res);

} else {
    sendRes(400, "Введите данные", res);
}
});



app.put("/user/:id", (req, res) => {
    const { name, isMan, age } = req.body;
    const { id } = req.params;
    const ind = users.findIndex(el => el.id == id);

    switch(ind) {
        case -1:
            sendRes(404, "Такого пользователя не существует", res);
            break;

        default: 
            if (!(name && isMan && age)) {
                sendRes(400, "Измените все поля пользователя", res);

    } else {
            users[ind] = {
            ...users[ind], 
            name,
            isMan,
            age
        }

        sendRes(201, users[ind], res); 
    }
}
});

app.patch("/user/:id", (req, res) => {
    const { name, isMan, age } = req.body;
    const { id } = req.params;
    const ind = users.findIndex(el => el.id == id);
     
    if (ind !== -1) {
        users[ind] = {
            ...users[ind], 
            ...req.body
    }
    sendRes(201, users[ind], res);

    } else {
        sendRes(404, "Такого пользователя не существует", res);
    }
});


app.delete("/user/:id", (req, res) => {
    const { id } = req.params;
    const ind = users.findIndex(el => el.id == id);

    if (ind !== -1) {
        users.splice(ind, 1);
        sendRes(201, true, res);

    } else {
        sendRes(404, "Такого пользователя не существует", res);
    }
});

const PORT = process.env.PORT || 3000;


app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}/`));