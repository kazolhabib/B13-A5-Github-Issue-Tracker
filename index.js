let allData = [];

const issueDetails = document.getElementById('issueDetails');

// Sign in Function
document.addEventListener("DOMContentLoaded", function() {
    const signInBtn = document.getElementById("sign-in-btn");
    
    if (signInBtn) {
        signInBtn.addEventListener("click", function(event) {
            event.preventDefault(); 
            
            const userValue = document.getElementById("user-name").value;
            const userPassword = document.getElementById("password").value;

            if (userValue === "admin" && userPassword === "admin123") {
                localStorage.setItem("isLoggedIn", "true");
                window.location.href = "./home.html";
            } else {
                alert("Sign In Failed!");
            }
        });
    }
});

//Fetch All Data
async function fetchAllIssues() {
    loadingSpinner(true);
    try {
        const res = await fetch('https://phi-lab-server.vercel.app/api/v1/lab/issues');
        const data = await res.json();
        allData = data;
        displayIssues(data);
    } catch (err) {
        console.error("Fetch Error:", err);
        document.getElementById('issuesContainer').innerHTML = `<p class="text-red-500 text-center col-span-full">Failed to load data.</p>`;
    } finally {
        loadingSpinner(false);
    }
};

//Fetch All Data
async function fetchIssue(id) {
    loadingSpinner(true);
    try {
        const res = await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`);
        const data = await res.json();
        displayDetails(data)
        
    } catch (err) {
        console.error("Fetch Error:", err);
        document.getElementById('issuesContainer').innerHTML = `<p class="text-red-500 text-center col-span-full">Failed to load data.</p>`;
    } finally {
        loadingSpinner(false);
    }
};

async function showModalWithDetails(id){
    await fetchIssue(id)
    issueDetails.showModal()
}

function displayDetails(details){
    const detailsContainer = document.getElementById("issueDetailsContainer")
    const dateObj = new Date(details.data.createdAt);
    const formattedDate = `${dateObj.getMonth() + 1}/${dateObj.getDate()}/${dateObj.getFullYear()}`;
const isClosed = details.data.status?.toLowerCase() === 'closed';
        const topColor = isClosed ? 'bg-purple-600' : 'bg-emerald-500';

        //Badge Logic
        const priority = details.data.priority?.toUpperCase() || 'LOW';
        const priorityClass = priority === 'HIGH' ? 'text-rose-500 bg-[#FEECEC]' : 
        priority === 'MEDIUM' ? 'bg-[#FFF6D1] text-amber-500' : 'text-gray-500 bg-[#EEEFF2]';
    detailsContainer.innerHTML =""

    const detailsHtml = ` <div class="" >
        
        <div class="mb-6">
            <h2 class="text-2xl font-bold 1F2937 mb-2.5">${details.data.title}</h2>
            <div class="flex items-center gap-2 text-[#64748B] text-sm font-medium">
                <span class="badge ${topColor} gap-2 py-1.5 px-2 text-white font-semibold text-xs capitalize rounded-full">
                    
                    ${details.data.status}
                </span>
                <span>•</span>
                <span>Opened by <span class="">${details.data.author}</span></span>
                <span>•</span>
                <span>${formattedDate}</span>
            </div>
        </div>

        <div class="flex gap-2 mb-6">
           ${details.data.labels.map(label=>{

        const bgColor = label === "bug" ? "bg-[#FEECEC] border-[#FECACA] text-[#EF4444]" :label === "enhancement" ? "bg-[#DEFCE8] border-[#BBF7D0] text-[#00A96E]": label === "help wanted" ? "bg-[#FFF8DB] border-[#FDE68A] text-[#D97706]":""     
        const icon = label === "bug" ?  `<img src="./assets/bug.svg" alt="bug"/>`
        : label ==="enhancement"? `<img src="./assets/enhancement.svg" alt="enhancement"/>`
        : label === "help wanted" ? `<img src="./assets/help.svg" alt="help"/>`:"";

        return `<span class="${bgColor} border rounded-[100px] flex items-center gap-2 text-xs font-medium px-3 py-1">${icon} ${label.toUpperCase()}</span>`
            }).join("")}
        </div>

        <p class="text-[#64748B] text-lg leading-relaxed mb-8 sm:mb-10">
             ${details.data.description}
        </p>

        <div class="bg-[#F8FAFC] rounded-xl p-4 grid grid-cols-2 gap-8">
            <div>
                <p class="text-[#64748B] text-base mb-1 tracking-wide">Assignee:</p>
                <p class="text-[#1F2937] text-lg font-semibold">${details.data.assignee ? details.data.assignee: "No Assignee found"}</p>
            </div>
            <div>
                <p class="text-[#64748B] text-base mb-1">Priority:</p>
                <span class="badge ${priorityClass} rounded-lg">${details.data.priority.toUpperCase()}</span>
            </div>
        </div>
    </div>`

    detailsContainer.innerHTML +=detailsHtml
}

//Display Function
function displayIssues(issues) {
    const container = document.getElementById('issuesContainer');
    const countLabel = document.getElementById('issueCount');
    
    container.innerHTML = "";
    countLabel.innerText = `${issues.data.length} Issues`;

    if(issues.data.length === 0) {
        container.innerHTML = `<p class="text-gray-400 text-center col-span-full py-10">No issues found.</p>`;
        return;
    }

    issues.data.forEach(issue => {
        const isClosed = issue.status?.toLowerCase() === 'closed';
        const topColor = isClosed ? 'bg-purple-600' : 'bg-emerald-500';

        //Badge Logic
        const priority = issue.priority?.toUpperCase() || 'LOW';
        const priorityClass = priority === 'HIGH' ? 'text-rose-500 bg-[#FEECEC]' : 
        priority === 'MEDIUM' ? 'bg-[#FFF6D1] text-amber-500' : 'text-gray-500 bg-[#EEEFF2]';
    const dateObj = new Date(issue.createdAt);
    const formattedDate = `${dateObj.getMonth() + 1}/${dateObj.getDate()}/${dateObj.getFullYear()}`;

        const cardHtml = `
            <div class="card bg-white border border-gray-100 shadow-md rounded-lg overflow-hidden hover:border-gray-300 transition cursor-pointer">
                <div class="h-1 ${topColor}"></div> 
                <div class="card-body p-6 gap-3" onclick="showModalWithDetails(${issue.id})">
                    <div class="flex justify-between items-center mb-1">
                    ${issue.status === "open" ? `<img src="./assets/open-status.png" alt=""/>`
                        :`<img src="./assets/closed-status.png" alt=""/>`}
                        <span class="badge badge-sm badge-outline ${priorityClass} font-medium px-3">${priority}</span>
                    </div>
                    <h3 class="card-title text-base font-semibold leading-tight text-[#1F2937]">${issue.title}</h3>
                    <p class="text-[#64748B] text-sm line-clamp-2">${issue.description || 'No description available...'}</p>
                    <div class="flex flex-wrap gap-2 mt-2">
                    ${issue.labels.map(label=>{

        const bgColor = label === "bug" ? "bg-[#FEECEC] border-[#FECACA] text-[#EF4444]" :label === "enhancement" ? "bg-[#DEFCE8] border-[#BBF7D0] text-[#00A96E]": label === "help wanted" ? "bg-[#FFF8DB] border-[#FDE68A] text-[#D97706]":""     
        const icon = label === "bug" ?  `<img src="./assets/bug.svg" alt="bug"/>`
        : label ==="enhancement" ? `<img src="./assets/enhancement.svg" alt="enhancement"/>`
        : label === "help wanted" ? `<img src="./assets/help.svg" alt="help"/>` : "";

        return `<span class="${bgColor} border rounded-[100px] flex items-center gap-2 text-xs font-medium px-3 py-1">${icon} ${label.toUpperCase()}</span>`
            }).join("")}
                        
            </div>
            <div class="flex flex-col justify-between text-xs text-gray-500 border-t border-gray-100 pt-4 gap-2 mt-3">
                <span class="font-medium text-gray-600">#${issue.id} by ${issue.author || 'unknown'}</span>
                    <span>${formattedDate || 'N/A'}</span>
                    </div>
                </div>
            </div>
        `;
        container.innerHTML += cardHtml;
    });
};

//Search Logic
document.getElementById('searchInput').addEventListener('input', async (e) => {
    const text = e.target.value;
    if (text.length > 2) {
        const res = await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${text}`);
        const searchResults = await res.json();
        displayIssues(searchResults);
    } else if (text.length === 0) {
        displayIssues(allData);
    }
});

//Filter Logic
function filterIssues(status) {
    // Update button styles
    const btns = document.querySelectorAll('.filter-btn');
    btns.forEach(btn => {
        btn.classList.remove('btn-primary');
        btn.classList.add('btn-ghost');
        if(btn.innerText.toLowerCase() === status) {
            btn.classList.add('btn-primary');
            btn.classList.remove('btn-ghost');
        }
    });

    if(status === 'all') {
        displayIssues(allData);
    } else {
        const filtered = allData.data.filter(item => item.status?.toLowerCase() === status);
        const filteredData = {data: filtered}
        displayIssues(filteredData);
    }
};

function loadingSpinner(show) {
    document.getElementById('loading').classList.toggle('hidden', !show);
    document.getElementById('issuesContainer').classList.toggle('hidden', show);
};

fetchAllIssues();