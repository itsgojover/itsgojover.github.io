let peopleData = [];

async function fetchPeopleData() {
  try {
    const response = await fetch("./data/people.json");
    const data = await response.json();
    peopleData = data;
  } catch (error) {
    console.error("Error fetching people data:", error);
  }
}

function generateTreeHTML(personID) {
  const node = peopleData.find((p) => p.id === personID);
  if (node) {
    console.log(node.id);
    var liElement = document.createElement("li");

    var aElement = document.createElement("a");
    aElement.setAttribute("href", "javascript:void(0);");

    var memberViewBox = document.createElement("div");
    memberViewBox.classList.add("member-view-box");

    var memberImage = document.createElement("div");
    memberImage.classList.add("member-image");

    var imgElement = document.createElement("img");
    imgElement.setAttribute("src", "./data/person.png");
    imgElement.setAttribute("alt", "Member");

    var memberDetails = document.createElement("div");
    memberDetails.classList.add("member-details");

    var h3Element = document.createElement("h3");
    h3Element.textContent = `${node.name} ${node.surname}`;

    memberDetails.appendChild(h3Element);
    memberImage.appendChild(imgElement);
    memberImage.appendChild(memberDetails);
    memberViewBox.appendChild(memberImage);
    aElement.appendChild(memberViewBox);
    liElement.appendChild(aElement);

    if (node.children && node.children.length > 0) {
      var ulElement = document.createElement("ul");
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
  fetchPeopleData().then((data) => {
    var treeRoot = document.querySelector(".genealogy-tree>ul");
    treeRoot.appendChild(generateTreeHTML(0));

    // jQuery for Show/Hide Functionality
    $(function () {
      // This is a shortcut for $(document).ready(...)
      $(".genealogy-tree ul").hide();
      $(".genealogy-tree>ul").show();
      $(".genealogy-tree ul.active").show();

      $(".genealogy-tree li > a").on("click", function (e) {
        // Select the <a> tag inside the <li>
        var children = $(this).parent().find("> ul"); // Find the direct child <ul> of the <li>
        if (children.is(":visible")) {
          children.hide("fast").removeClass("active");
        } else {
          children.show("fast").addClass("active");
        }
        e.stopPropagation();
      });
    });
  });
}
