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


function adjust_body_size() {
  const treeWidth = document.querySelector(".genealogy-tree").offsetWidth;
  const bodyWidth = window.innerWidth;;

  console.log(treeWidth, bodyWidth);

  document.body.style.width = Math.max(treeWidth, bodyWidth) + "px";
}

function renderTree() {
  fetchPeopleData().then((data) => {
    var treeRoot = document.querySelector(".genealogy-tree>ul");
    treeRoot.appendChild(generateTreeHTML(0));

    // jQuery for Show/Hide Functionality
    $(function () {
      // Hide all <ul> initially, then show the top level
      $(".genealogy-tree ul").hide();
      $(".genealogy-tree>ul").show();
      $(".genealogy-tree ul.active").show();

      $(".genealogy-tree li > a").on("click", function (e) {
        e.stopPropagation(); // Stop event bubbling

        var clickedLi = $(this).parent(); // Get the <li> containing the clicked <a>
        var children = clickedLi.find("> ul"); // Get direct children <ul> of the clicked <li>
        var isCurrentlyOpen = children.is(":visible"); // Check if children are visible

        // Close all sibling <li> elements and their children
        clickedLi.siblings().find("ul").hide("fast").removeClass("active");

        // Toggle the children of the clicked element
        if (isCurrentlyOpen) {
          // Close children and their descendants recursively
          children.find("ul").hide("fast").removeClass("active");
          children.hide("fast").removeClass("active");

          setTimeout(() => {adjust_body_size();}, 300);
        } else {
          children.show("fast").addClass("active");

          setTimeout(() => {adjust_body_size();}, 300);
        }
      });
    });

    let isExpanded = false; // Track if the tree is expanded or not

    // Functionality for the Expand/Shrink All button
    $("#expandAll").on("click", function () {
      if (!isExpanded) {
        $(".genealogy-tree ul").show("fast").addClass("active");
        $(this).text("Shrink All"); // Change button text

        setTimeout(() => {adjust_body_size();}, 300);
      } else {
        $(".genealogy-tree ul")
          .not(".genealogy-tree > ul")
          .hide("fast")
          .removeClass("active");
        $(this).text("Expand All"); // Change button text back

        setTimeout(() => {adjust_body_size();}, 300);
      }
      isExpanded = !isExpanded; // Toggle the expanded state
    });

    let isDragging = false; // Flag to track if the mouse button is held down
    let startX, startY; // Variables to store the initial mouse position

    // Prevent default right-click behavior (optional, to avoid context menu)
    window.addEventListener("contextmenu", (e) => e.preventDefault());

    // Mouse down event listener
    document.addEventListener("mousedown", (e) => {
      if (e.button === 0) {
        // Check if it's the left mouse button
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        document.body.style.cursor = "grabbing"; // Optional: Change cursor to grabbing hand

        // Prevent text selection on drag start
        e.preventDefault();
      }
    });

    // Mouse up event listener
    document.addEventListener("mouseup", (e) => {
      if (e.button === 0) {
        isDragging = false;
        document.body.style.cursor = "default"; // Optional: Reset cursor
      }
    });

    // Mouse move event listener
    document.addEventListener("mousemove", (e) => {
      if (isDragging) {
        const dx = e.clientX - startX; // Calculate horizontal scroll distance
        const dy = e.clientY - startY; // Calculate vertical scroll distance

        window.scrollBy(-dx, -dy); // Scroll the window

        // Update the starting position for the next calculation
        startX = e.clientX;
        startY = e.clientY;
      }
    });
  });
}
