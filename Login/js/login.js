const login = document.querySelector(".login")
const loginForm = login.querySelector(".login_form")
const loginInput = login.querySelector(".login_input")
const loginPass = login.querySelector(".login_pass")

const colors = [
    "cadetblue",
    "darkgoldenrod",
    "cornflowerblue",
    "darkkhaki",
    "hotpink",
    "gold"
]

const getRandomColor = () => {
    const randomIndex = Math.random()
}

const user = { id: "", name: "", password: "", color: "" }

const handleSubmit = (event) => {
    event.preventDefault()

    user.id = crypto.randomUUID()
    user.name = loginInput.value
    user.password = loginPass.value

    console.log(user)
}

loginForm.addEventListener("submit", handleSubmit)