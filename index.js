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
            res
            .status(400)
            .json("Неправильный запрос");
    }
});


app.get("/filtredUsers", (req, res) => {
    const { min, max } = req.query;

    if (min > 0 && max <= 100) {
        const find = users.filter(el => el.age >= min && el.age <= max);
        find.length === 0? res.json("Не найдено пользователей, попадающих под диапазон возраста") : res.json(find);
         
    } else {
        res
            .status(400)
            .json("Превышен диапазон возраста для получения пользователей");
    }
})


app.post("/user", (req, res) => {
    const getRes = (num, text) => {
        res
           .status(num)
           .json(text);
    }

    if (Object.keys(req.body).length !== 0) {

    const { name, isMan, age } = req.body;

    !(name && isMan && age) ? getRes(400, "Заполните нужные поля") : users.push(new User(name, isMan, age)) && getRes(201, req.body);

} else {
    getRes(400, "Введите данные");
}
});



app.put("/user/:id", (req, res) => {
    const getRes = (num, text) => {
        res
        .status(num)
        .json(text);
    }

    const { name, isMan, age } = req.body;
    const { id } = req.params;
    const ind = users.findIndex(el => el.id == id);

    switch(ind) {
        case -1:
            getRes(404, "Такого пользователя не существует");
            break;

        default: 
            if (!(name && isMan && age)) {
            getRes(400, "Измените все поля пользователя");

    } else {
            users[ind] = {
            ...users[ind], 
            name,
            isMan,
            age
        }

        getRes(201, users[ind]); 
    }
}
});

app.patch("/user/:id", (req, res) => {
    const getRes = (num, text) => {
        res
        .status(num)
        .json(text);
    }

    const { name, isMan, age } = req.body;
    const { id } = req.params;
    const ind = users.findIndex(el => el.id == id);
     
    if (ind !== -1) {
        users[ind] = {
            ...users[ind], 
            ...req.body
    }
        getRes(201, users[ind]);

    } else {
        getRes(404, "Такого пользователя не существует");
    }
});


app.delete("/user/:id", (req, res) => {
    const getRes = (num, text) => {
        res
        .status(num)
        .json(text);
    }

    const { id } = req.params;
    const ind = users.findIndex(el => el.id == id);

    if (ind !== -1) {
        users.splice(ind, 1);
        getRes(201, true);

    } else {
        getRes(404, "Такого пользователя не существует");
    }
});

const PORT = process.env.PORT || 3000;


app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}/`));