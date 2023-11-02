// Initialize a map to store blog data
const blogs = new Map();

// Get references to HTML elements
const modal = document.getElementById('modal');
const blogsContainer = document.getElementById('blog-container');
const btnCreateBlog = document.getElementById('btn-create-blog');
const btnSubmit = document.getElementById('btn-submit');
const closeModal = document.getElementById('closeModal');
const crtBlogForm = document.getElementById('crt-blog-form');
const blogIdInput = document.getElementById('blog-id');

// Function to render blogs
function renderBlogs() {
    // Clear the blogs container
    blogsContainer.innerHTML = '';

    // Iterate through the blogs and create blog cards
    blogs.forEach((blog) => {
        const blogCard = document.createElement('div');
        blogCard.className = 'blog-card';
        blogCard.style.height = '220px';

        // Populate the blog card with content
        blogCard.innerHTML = `
      <h3 blog-id="${blog.id}" class="blog-title">${blog.title}</h3>
      <span class="blog-time">${blog.date}</span>
      <p class="blog-description">${blog.content}</p>
      <p class="blog-author">${blog.author}</p>
      <i class="fa-solid fa-pen-to-square" data-blog-id="${blog.id}"></i>
    `;

        const blogContent = blogCard.querySelector('.blog-description');
        const editIcon = blogCard.querySelector('.fa-pen-to-square');

        // Add a click event listener for editing a blog
        editIcon.addEventListener('click', () => {
            const blogId = editIcon.getAttribute('data-blog-id');
            const blogToEdit = blogs.get(Number(blogId));

            if (blogToEdit) {
                const crtTitle = document.getElementById('crt-title');
                crtTitle.value = blogToEdit.title;
                crtTitle.disabled = true;
                document.getElementById('crt-author').value = blogToEdit.author;
                document.getElementById('crt-content').value = blogToEdit.content;
                blogIdInput.value = blogToEdit.id;
                modal.style.display = 'block';
            }
        });

        // Add the blog card to the blogs container

        blogsContainer.appendChild(blogCard);

        // Toggling visibility of blog content
        blogCard.addEventListener('click', () => {
            if (blogContent.style.overflow === '' || blogContent.style.overflow === 'hidden') {
                blogContent.style.overflow = 'visible';
                blogContent.style.whiteSpace = 'initial';
                blogContent.style.textOverflow = 'initial';

                blogCard.style.height = `${blogCard.clientHeight + blogContent.clientHeight}px`;
            } else {
                blogContent.style.overflow = 'hidden';
                blogContent.style.whiteSpace = 'nowrap';
                blogContent.style.textOverflow = 'ellipsis';

                blogCard.style.height = '220px';
            }
        });
    });
}

// Add an event listener for creating a new blog
btnCreateBlog.addEventListener('click', () => {
    const crtTitle = document.getElementById('crt-title');
    crtTitle.value = '';
    crtTitle.disabled = false;
    document.getElementById('crt-content').value = '';
    document.getElementById('crt-author').value = '';
    blogIdInput.value = '';
    modal.style.display = 'block';
});

// Add an event listener for submitting a blog
btnSubmit.addEventListener('click', (evt) => {

    const title = document.getElementById('crt-title').value;
    const content = document.getElementById('crt-content').value;
    const author = document.getElementById('crt-author').value;
    const blogId = Number(blogIdInput.value);
    const createdAt = new Date().toLocaleString();

    if (title && content && author) {
        if (!blogId) {
            const newBlogId = blogs.size + 1;
            blogs.set(newBlogId, {
                id: newBlogId,
                title,
                content,
                author,
                date: createdAt,
            });
        } else if (blogs.has(blogId)) {
            const existingBlog = blogs.get(blogId);
            existingBlog.title = title;
            existingBlog.content = content;
            existingBlog.author = author;
            existingBlog.date = createdAt;
        }

        renderBlogs();
        modal.style.display = 'none';
    }
});

// Add an event listener for the blog creation form
crtBlogForm.addEventListener('submit', (evt) => {
    evt.preventDefault();
});

// Add an event listener for closing the modal
closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
});

// Function to fetch blogs from an external source
function fetchBlogs() {
    const blogsURI = '/data/blogs.json';
    const xhr = new XMLHttpRequest();
    xhr.open('GET', blogsURI);
    xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
            try {
                const blogsList = JSON.parse(xhr.responseText);
                blogsList.forEach((item) => {
                    blogs.set(item.id, item);
                });
                renderBlogs();
            } catch (error) {
                console.error('Error parsing JSON:', error);
            }
        } else {
            console.error('Request failed with status:', xhr.status);
        }
    });
    xhr.send();
}

// Fetch blogs when the page loads
fetchBlogs();
