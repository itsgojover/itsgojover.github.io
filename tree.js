let peopleData = [];

async function fetchPeopleData() {
    try {
        const response = await fetch('../people.json');
        const data = await response.json();
        peopleData = data;
    } catch (error) {
        console.error('Error fetching people data:', error);
    }
}

function generateTreeHTML(personID) {
    const node = peopleData.find(p => p.id === personID);
    if(node)
    {
        console.log(node.id);
        var liElement = document.createElement('li');

        var aElement = document.createElement('a');
        aElement.setAttribute('href', 'javascript:void(0);');

        var memberViewBox = document.createElement('div');
        memberViewBox.classList.add('member-view-box');

        var memberImage = document.createElement('div');
        memberImage.classList.add('member-image');

        var imgElement = document.createElement('img');
        imgElement.setAttribute('src', './person.png');
        imgElement.setAttribute('alt', 'Member');

        var memberDetails = document.createElement('div');
        memberDetails.classList.add('member-details');
        
        var h3Element = document.createElement('h3');
        h3Element.textContent = node.name;

        memberDetails.appendChild(h3Element);
        memberImage.appendChild(imgElement);
        memberImage.appendChild(memberDetails);
        memberViewBox.appendChild(memberImage);
        aElement.appendChild(memberViewBox);
        liElement.appendChild(aElement);

        if (node.children && node.children.length > 0) {
            var ulElement = document.createElement('ul');
            node.children.forEach(function (child) {
                var childLi = generateTreeHTML(child);
                ulElement.appendChild(childLi);
            });
            liElement.appendChild(ulElement);
        }
    }
    return liElement;
}

function renderTree() {
    fetchPeopleData().then(data =>{
        var treeRoot = document.querySelector('.genealogy-tree>ul');
        treeRoot.appendChild(generateTreeHTML(0));

        var genealogyTreeUlList = document.querySelectorAll('.genealogy-tree ul');
        var genealogyTreeTopLevelUl = document.querySelector('.genealogy-tree>ul');
        var genealogyTreeActiveUlList = document.querySelectorAll('.genealogy-tree ul.active');
        var genealogyTreeLiList = document.querySelectorAll('.genealogy-tree li');

        genealogyTreeUlList.forEach(function (ul) {
            ul.style.display = 'none';
        });

        if (genealogyTreeTopLevelUl) {
            genealogyTreeTopLevelUl.style.display = 'block';
        }

        genealogyTreeActiveUlList.forEach(function (ul) {
            ul.style.display = 'block';
        });

        genealogyTreeLiList.forEach(function (li) {
            var box = li.querySelector('.member-image');
            box.addEventListener('click', function (e) {
                var children = li.querySelector('ul');
                if(children)
                {
                    if (children.style.display === 'block') 
                    {
                        children.style.display = 'none';
                        children.classList.remove('active');
                    } else 
                    {
                        children.style.display = 'block';
                        children.classList.add('active');
                    }
                }
                e.stopPropagation();
            });
        });
    });
}




