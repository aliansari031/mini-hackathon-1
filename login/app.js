
function showLogin() {
    document.getElementById("signupBox").style.display = "none";
    document.getElementById("loginBox").style.display = "block";
}

function showSignup() {
    document.getElementById("loginBox").style.display = "none";
    document.getElementById("signupBox").style.display = "block";
}

function signup() {
    var name = document.getElementById("su_name").value;
   var email = document.getElementById("su_email").value;
    var pass = document.getElementById("su_pass").value;

    if (!name || !email || !pass) {
        document.getElementById("signupMsg").innerText = "Please fill all fields!";
        return;
    }

   var users = JSON.parse(localStorage.getItem("users")) || [];

    if (users.some(u => u.email === email)) {
        document.getElementById("signupMsg").innerText = "Email already exists!";
        return;
    }

    users.push({ name, email, pass });
    localStorage.setItem("users", JSON.stringify(users));

    document.getElementById("signupMsg").style.color = "green";
    document.getElementById("signupMsg").innerText = "Account created! Please login.";

    showLogin();
}

function login() {
   var email = document.getElementById("li_email").value;
   var pass = document.getElementById("li_pass").value;

   var users = JSON.parse(localStorage.getItem("users")) || [];

    var user = users.find(u => u.email === email && u.pass === pass);

    if (!user) {
        document.getElementById("loginMsg").innerText = "Invalid email or password!";
        return;
    }

    localStorage.setItem("loggedUser", JSON.stringify(user));
    window.location.href = "home.html";
}

 

document.getElementById("logoutBtn")?.addEventListener("click", () => {
    localStorage.removeItem("loggedUser");
    window.location.href = "index.html";
});

 

var postsContainer = document.getElementById("posts");
var searchAuthor = document.getElementById("searchAuthor");
var postForm = document.getElementById("postform");
var captionInput = document.getElementById("postinput");
var imageInput = document.getElementById("imageinput");
var darkModeBtn = document.getElementById("dark-mode");

function loadPosts() {
    var saved = localStorage.getItem("posts");
    if (saved) return JSON.parse(saved);
    return defaultPosts;
}

function savePosts() {
    localStorage.setItem("posts", JSON.stringify(posts));
}

var defaultPosts = [
    {
        id: 1,
        author: "alex",
        content: "Exploring the mountains today!",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSE7qjXvzX0T--7cCogC6yAB8YCjjlbP2ROow&s",
        likes: 4,
        createdAt: new Date().toLocaleString(),
        reactions: { "👍": [], "❤️": [], "😂": [] },
        comments: []
    },
    {
        id: 2,
        author: "john",
        content: "What a beautiful day!",
        image: "https://static.vecteezy.com/system/resources/thumbnails/025/282/026/small/stock-of-mix-a-cup-coffee-latte-more-motive-top-view-foodgraphy-generative-ai-photo.jpg",
        likes: 2,
        createdAt: new Date().toLocaleString(),
        reactions: { "👍": [], "❤️": [], "😂": [] },
        comments: []
    }
];

var posts = loadPosts();

function renderPosts(list) {
    postsContainer.innerHTML = "";

    list.forEach(post => {
        var div = document.createElement("div");
        div.classList.add("post");

        div.innerHTML = `
            <h3>${post.author}</h3>

            <textarea id="edit-text-${post.id}" class="edit-area" 
                      style="display:none; width:100%; padding:10px">${post.content}</textarea>

            <p id="post-text-${post.id}">${post.content}</p>

            <img src="${post.image}" alt="">

            <p class="timestamp">${post.createdAt}</p>

            <div class="post-footer">
                <button onclick="likePost(${post.id})">Like 👍 (${post.likes})</button>
                <button onclick="addReaction(${post.id}, '❤️')">❤️</button>
                <button onclick="addReaction(${post.id}, '😂')">😂</button>

                <button onclick="enableEdit(${post.id})" style="background:#f0a500;">Edit</button>
                <button onclick="deletePost(${post.id})" style="background:#e74c3c;">Delete</button>

                <button id="save-btn-${post.id}" onclick="saveEdit(${post.id})" 
                        style="background:#2ecc71; display:none;">Save</button>
            </div>

            <div class="comments-container">
                <p><strong>Comments:</strong></p>
                ${post.comments.map(c => `<p>• ${c}</p>`).join("")}

                <input type="text" placeholder="Add a comment" 
                    onkeypress="if(event.key==='Enter'){ addComment(${post.id}, this.value); this.value=''; }">
            </div>
        `;

        postsContainer.appendChild(div);
    });
}

renderPosts(posts);

 

searchAuthor?.addEventListener("input", () => {
    var value = searchAuthor.value.toLowerCase();
   var filtered = posts.filter(p => p.author.toLowerCase().includes(value));
    renderPosts(filtered);
});

 

postForm?.addEventListener("submit", e => {
    e.preventDefault();

    if (!captionInput.value || !imageInput.files[0]) {
        alert("Caption + Image required!");
        return;
    }

    var reader = new FileReader();
    reader.onload = () => {
        var newPost = {
            id: Date.now(),
            author: "You",
            content: captionInput.value,
            image: reader.result,
            likes: 0,
            createdAt: new Date().toLocaleString(),
            reactions: { "👍": [], "❤️": [], "😂": [] },
            comments: []
        };

        posts.unshift(newPost);
        savePosts();
        renderPosts(posts);
        postForm.reset();
    };

    reader.readAsDataURL(imageInput.files[0]);
});

 

function likePost(id) {
    var post = posts.find(p => p.id === id);
    post.likes++;
    savePosts();
    renderPosts(posts);
}

function addReaction(id, emoji) {
    var post = posts.find(p => p.id === id);
    post.reactions[emoji].push("1");
    savePosts();
    renderPosts(posts);
}

 

function addComment(id, text) {
    if (!text.trim()) return;
   var post = posts.find(p => p.id === id);
    post.comments.push(text);
    savePosts();
    renderPosts(posts);
}

 

function enableEdit(id) {
    document.getElementById(`edit-text-${id}`).style.display = "block";
    document.getElementById(`post-text-${id}`).style.display = "none";
    document.getElementById(`save-btn-${id}`).style.display = "inline-block";
}

function saveEdit(id) {
    var newText = document.getElementById(`edit-text-${id}`).value;
    var post = posts.find(p => p.id === id);
    post.content = newText;
    savePosts();
    renderPosts(posts);
}

 

function deletePost(id) {
    if (!confirm("Are you sure you want to delete this post?")) return;
    posts = posts.filter(p => p.id !== id);
    savePosts();
    renderPosts(posts);
}

 

darkModeBtn?.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    darkModeBtn.textContent = document.body.classList.contains("dark") ? "Light" : "Dark";
});
