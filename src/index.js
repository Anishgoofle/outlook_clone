let mailsList = [];
let selectMail = {};
let readMails = [];
let favEmails = [];
let unreadBtn = document.querySelector(".unread");
let readBtn = document.querySelector(".read");
let favBtn = document.querySelector(".fav");
let buttons = [unreadBtn, readBtn, favBtn];
let mailListContainer = document.querySelector(".mail-list");
let selectedTab = unreadBtn;
selectedTab.classList.add("selected");

function hightLightActiveTab(btn) {
  buttons.forEach((btn) => btn.classList.remove("selected"));
  selectedTab = btn.className;
  btn.classList.add("selected");
  renderTab(btn);
}

buttons.forEach((btn) => {
  btn.addEventListener("click", () => {
    hightLightActiveTab(btn);
  });
});

function convertTimeStampToDate(timestamp) {
  const d = new Date(timestamp);
  return d.toLocaleString();
}

function renderTab() {
  const section = document.querySelector(".mail-details");
  if (section) {
    section.remove();
  }
  if (selectedTab === "unread") {
    renderMails(mailsList);
  } else if (selectedTab === "read") {
    renderMails(readMails);
  } else {
    renderMails(favEmails);
  }
}

function renderEmailDetails() {
  // main
  const main = document.querySelector("main");
  const section = document.querySelector(".mail-details");
  if (section) {
    section.remove();
  }

  // section
  const sectionMailDetails = document.createElement("section");
  sectionMailDetails.classList.add("mail-details");

  // avatar
  const avatar = document.createElement("div");
  avatar.classList.add("avatar");

  const tempSpan = document.createElement("span");
  tempSpan.innerText = "f";
  avatar.appendChild(tempSpan);

  // content
  const content = document.createElement("div");
  content.classList.add("content");

  // content header
  const contentHeader = document.createElement("div");
  contentHeader.classList.add("content-header");

  const headerText = document.createElement("div");
  headerText.classList.add("header-text");

  const textSpan = document.createElement("span");
  textSpan.innerText = selectMail.subject;

  const textSpan2 = document.createElement("span");
  textSpan2.innerText = selectMail.date;

  const headerActions = document.createElement("div");
  headerActions.classList.add("header-actions");
  let mail = readMails.find((mail) => mail.id === selectMail.id);

  const button = document.createElement("button");
  if (!mail.fav) {
    button.innerText = "Mark As Favourite";
    button.addEventListener("click", function () {
      readMails[readMails.indexOf(mail)].fav = true;
      favEmails.push(readMails[readMails.indexOf(mail)]);
      button.innerText = "Favourite";
      button.setAttribute("disabled", "");
    });
  } else {
    button.innerText = "Favourite";
    button.setAttribute("disabled", "");
  }

  headerActions.appendChild(button);
  headerText.appendChild(textSpan);
  headerText.appendChild(textSpan2);

  // content text
  const contentText = document.createElement("div");
  contentText.classList.add("content-text");
  contentText.innerHTML = selectMail.data.body;

  contentHeader.appendChild(headerText);
  contentHeader.appendChild(headerActions);

  content.appendChild(contentHeader);
  content.appendChild(contentText);

  //   const article = document.createElement("article");
  sectionMailDetails.appendChild(avatar);
  sectionMailDetails.appendChild(content);

  main.appendChild(sectionMailDetails);
}

async function fetchEmailDescription(id) {
  const res = await fetch(
    `https://flipkart-email-mock.now.sh/?id=${id}`
  ).then((res) => res.json());
  selectMail.data = res;
  renderEmailDetails();
}

function onArticleClick(mailId, subject, date) {
  const section = document.querySelector(".mail-details");
  if (section) {
    section.innerHTML = "";
    section.innerHTML = "Loading";
  }
  let mailObj = mailsList.find((mail) => mail.id === mailId);
  if (mailObj) {
    mailsList.splice(mailsList.indexOf(mailObj), 1);
    mailObj = { ...mailObj, unread: false };
    readMails.push(mailObj);
  }

  selectMail.subject = subject;
  selectMail.date = convertTimeStampToDate(date);
  selectMail.id = mailId;

  fetchEmailDescription(mailId);
}

function renderMails(list) {
  if (mailListContainer) {
    mailListContainer.innerHTML = "";
  }
  if (!list.length) return;
  list.forEach((elm) => {
    // creating new Article
    const article = document.createElement("article");
    article.classList.add("mail");
    article.addEventListener("click", function () {
      onArticleClick(elm.id, elm.subject, elm.date);
    });

    //creating avatar
    const avatar = document.createElement("div");
    avatar.classList.add("avatar");

    const avSpan = document.createElement("span");
    avSpan.innerText = elm?.from?.name[0].toUpperCase();
    avatar.appendChild(avSpan);

    //creating info section
    const info = document.createElement("div");
    info.classList.add("info");

    // text-info

    //from
    const fromSection = document.createElement("div");
    fromSection.classList.add("text-info");
    fromSection.innerText = "From :";

    // from child
    const email = document.createElement("span");
    email.innerText = `${elm?.from?.name} <${elm?.from?.email}>`;
    fromSection.appendChild(email);

    // subject
    const subJect = document.createElement("div");
    subJect.classList.add("text-info");
    subJect.innerText = "Subject:";

    // subject child
    const subChild = document.createElement("span");
    subChild.innerText = elm?.subject;
    subJect.appendChild(subChild);

    // mail text
    const details = document.createElement("div");
    details.classList.add("text-info");
    details.innerText = elm?.short_description;

    // mail date
    const dateSection = document.createElement("div");
    dateSection.classList.add("text-info");
    dateSection.innerText = convertTimeStampToDate(elm?.date);

    //creating info
    info.appendChild(fromSection);
    info.appendChild(subJect);
    info.appendChild(details);
    info.appendChild(dateSection);

    //creating article
    article.appendChild(avatar);
    article.appendChild(info);

    //adding to list
    mailListContainer.appendChild(article);
  });
}

async function fetchEmails() {
  const res = await fetch("https://flipkart-email-mock.now.sh/").then((res) =>
    res.json()
  );
  mailsList = res.list;
  mailsList.map((mail) => (mail.unread = true));
  mailsList.map((mail) => (mail.fav = false));
  renderMails(mailsList);
}

fetchEmails();
