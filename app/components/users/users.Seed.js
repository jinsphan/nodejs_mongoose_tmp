const seed = [
    {
        username: "admin",
        hashed_password: "$2b$10$vROvTwYDBlWvRqc6eTOlS.vHHZZ5IqcstbZj9H2KXR4eHJiw7ycmi",
        fullname: "admin",
        avatar: "deafult_avatar.png",
        role: 1
    },
    {
        username: "user1",
        hashed_password: "$2b$10$vROvTwYDBlWvRqc6eTOlS.vHHZZ5IqcstbZj9H2KXR4eHJiw7ycmi",
        fullname: "user1",
        avatar: "deafult_avatar.png",
        role: 2
    },
    {
        username: "user2",
        hashed_password: "$2b$10$vROvTwYDBlWvRqc6eTOlS.vHHZZ5IqcstbZj9H2KXR4eHJiw7ycmi",
        fullname: "user2",
        avatar: "deafult_avatar.png",
        role: 2
    },
    {
        username: "user3",
        hashed_password: "$2b$10$vROvTwYDBlWvRqc6eTOlS.vHHZZ5IqcstbZj9H2KXR4eHJiw7ycmi",
        fullname: "user3",
        avatar: "deafult_avatar.png",
        role: 2
    },
    {
        username: "user4",
        hashed_password: "$2b$10$vROvTwYDBlWvRqc6eTOlS.vHHZZ5IqcstbZj9H2KXR4eHJiw7ycmi",
        fullname: "user4",
        avatar: "deafult_avatar.png",
        role: 2
    }
];


module.exports = {
    seed,
    modelName: 'User'
};

/*
    Role of user:
        1 - Admin,
        2 - User,
*/