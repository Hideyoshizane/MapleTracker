window.bossList;
window.bossJson;
window.server;
window.selectedList;
window.Character;
window.username;


document.addEventListener('DOMContentLoaded', async () => {
    server = getCookie('selectedServerContent'); 
    if(server == undefined) {
      server = 'Scania';
      setCookie('selectedServerContent', server, 7);
    }
    await fetchBossList();
    server = selectedList.name;
    Character = selectedList.characters[0];
    await loadPage();
    if(Character){
      setupCharacterDropdownToggle();
      setupCharacterButtonsEvent();
      setupBossesButtonEvent();

    }
    
    const button = document.querySelector('.teste');
    button.addEventListener('click', async () =>{
        const placeholder = [
            {
              server: server,
              userOrigin: username,
              characters: [
                {
                  name: 'Sayaka',
                  bosses: [{
                    name: 'Zakum',
                    difficulty: "Easy",
                    value: '1000000',
                    reset: 'Daily',
                    checked: false,
                    DailyTotal: '5',
                    date: null,

                  }, 
                  {
                    name: 'Zakum',
                    difficulty: "Chaos",
                    value: '423423423',
                    reset: 'Weekly',
                    checked: false,
                    date: null,
                  }
                 ],
                },
                {
                  name: 'Lilith',
                  bosses: [{
                    name: 'Zakum',
                    difficulty: "Easy",
                    value: '1000000',
                    reset: 'Daily',
                    checked: false,
                    DailyTotal: '7',
                    date: null, 
                  }],
                },
              ],
            },
          ];
      fetch('/saveBossChange', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(placeholder),
      });
    });

});

async function fetchBossList(){
    try {
      username = document.getElementById("userdata").getAttribute('data-username');
    
      const response =  await fetch(`/bossList/${username}`);
      bossList = await response.json();
  
  
      selectedList = bossList.server;
      selectedList = selectedList.find(servers => servers.name === server);
    } catch (error) {
      console.error('Error fetching character data:', error);
    }
  }

async function loadPage(){
    await loadTopButtons();
    if(Character){
      await loadCharacterSelector();
      await loadCharacterIncome();
      await loadBosses();
    }
    else{
      await loadMissingCharacter();
    }
    
}

async function loadTopButtons(){
    await createBossingLogo();
    await createTotalSelected();
    await createTotalIncome();
    await createTopButtons();
}

async function createBossingLogo(){
  const parentDiv = document.querySelector('.topButtons');

  const bossDiv = createDOMElement('div', 'bossDiv');
  
  const bossIconpath = '../../public/assets/icons/menu/boss_slayer.svg';
  const bossIcon = await loadEditableSVGFile(bossIconpath, 'bossIcon');

  const bossSpan = createDOMElement('span', 'bossHunting', 'Boss Hunting');

  bossDiv.appendChild(bossIcon);
  bossDiv.appendChild(bossSpan);

  parentDiv.appendChild(bossDiv);
}

async function loadEditableSVGFile(filePath, className) {
    try {
      const response = await fetch(filePath);
      const svgData = await response.text();
  
      const svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
     
      svgElement.innerHTML = svgData;
  
      if (className) {
        svgElement.classList.add(className);
      }
  
      const pathElements = svgElement.querySelectorAll("path");

      pathElements.forEach((path) => {
        path.setAttribute("fill", '#3D3D3D');
      });
      
      return svgElement;
  
    } catch (error) {
      console.error("Error loading SVG file:", error);
      return null;
    }
}


async function createTotalSelected(){
    const parentDiv = document.querySelector('.topButtons');
    const totalSelectedDiv = createDOMElement('div', 'totalSelectedDiv');
    const crystal = await createImageElement(`../../public/assets/icons/menu/crystal.webp`,'Boss Crystal Icon', 'crystalIcon');

    const selectedTotal = createDOMElement('span','selectedTotal', 'Selected Boss Total');
    const totalBosses = await calculateTotalBosses();
    const totalSelectedBosses = createDOMElement('span','totalSelectedBosses', `${totalBosses}/180`);

    const textDiv = createDOMElement('div', 'WeekTextDiv');

    
    totalSelectedDiv.appendChild(crystal);
    textDiv.appendChild(selectedTotal);
    textDiv.appendChild(totalSelectedBosses);
    totalSelectedDiv.appendChild(textDiv);
    parentDiv.appendChild(totalSelectedDiv);
}
    

async function calculateTotalBosses(){
    let totalBosses = 0;
    for(characters of selectedList.characters){
        for(bosses of characters.bosses){
            if(bosses.reset === 'Daily'){
                totalBosses += Number(bosses.DailyTotal);
            }
            else{
                totalBosses++;
            }
        }
    }
    return totalBosses;
}

async function createTotalIncome(){
    const parentDiv = document.querySelector('.topButtons');
    const totalIncomeDiv = createDOMElement('div', 'totalIncomedDiv');
    const Gold = await createImageElement(`../../public/assets/icons/menu/stash.webp`,'Gold Icon', 'stashIcon');
    const IncomeTextDiv = createDOMElement('div', 'IncomeTextDiv');
    const totalIncomeText = createDOMElement('span', 'totalIncomeText', 'All Characters Income');
    let totalIncome;
    if(Character){
      totalIncome = await calculateTotalIncome();
    }
    else{
      totalIncome = 0;
    }
    const totalIncomeSpan = createDOMElement('span', 'TotalIncome', `${totalIncome}`);
    const fontSize = await adjustFontSizeToFit(totalIncome, 224, 32);
    totalIncomeSpan.style.fontSize = fontSize + 'px';

    IncomeTextDiv.appendChild(totalIncomeText);
    IncomeTextDiv.appendChild(totalIncomeSpan);
    totalIncomeDiv.appendChild(Gold);
    totalIncomeDiv.appendChild(IncomeTextDiv);
    parentDiv.appendChild(totalIncomeDiv);

}
async function calculateTotalIncome(){
  let totalIncome = 0;
  for(character of selectedList.characters){
    totalIncome += character.totalIncome;
  }
  return totalIncome.toLocaleString('en-US');
}

async function adjustFontSizeToFit(totalGainValue, boxWidth, originalSize) {
    const maxWidth = boxWidth;
    const originalFontSize = originalSize;
  
    const copy = document.createElement('span');
    copy.textContent = totalGainValue;
    copy.style.fontSize = originalFontSize + 'px';
    copy.style.fontFamily = 'Inter';
    copy.style.whiteSpace = 'pre-line';
  
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = '-9999px';
  
    container.appendChild(copy);
    document.body.appendChild(container);
  
    let width = copy.offsetWidth;
    let fontSize = originalFontSize;
    while (width > maxWidth && fontSize > 0) {
      fontSize -= 1;
      copy.style.fontSize = fontSize + 'px';
      width = copy.offsetWidth;
    }
    document.body.removeChild(container);
    return fontSize;
}

async function createTopButtons(){
    const parentDiv = document.querySelector('.topButtons');
    const discardButton = createDOMElement('button', 'discardButton', 'Discard Changes');
    const saveButton = createDOMElement('button', 'saveButton', 'Save Changes');

    parentDiv.appendChild(discardButton);
    parentDiv.appendChild(saveButton);
}

async function loadCharacterSelector(){
    const parentDiv = document.querySelector('.characterSelector');

    const dropdownToggle = createDOMElement('button', 'dropdownToggle');
    dropdownToggle.id = 'dropdownToggle';

    const selectedCharacter = createDOMElement('div', 'selectedCharacter');
    const arrowSVG = await createArrowSVG();

    const characterContent = createDOMElement('div', 'characterContent');

    const fragment = document.createDocumentFragment();

    let isFirstButton = true;
    
    for(character of selectedList.characters){
        const createdButton = await createCharacterButton(character);
        createdButton.classList.toggle('not-checked');
        if(isFirstButton){  
            const createdSelectedButton = createdButton.cloneNode(true);

            createdSelectedButton.classList.replace('characterButton', 'SelectedCharacterButton');
            createdSelectedButton.appendChild(arrowSVG);

            selectedCharacter.appendChild(createdSelectedButton);
            isFirstButton = false;
            createdButton.classList.toggle('checked');
            createdButton.classList.toggle('not-checked');
            createdSelectedButton.classList.toggle('not-checked');
            const checkSVG = createCheckSVG();
            createdButton.appendChild(checkSVG);
        }

        fragment.appendChild(createdButton);
        characterContent.appendChild(fragment);
    }

    const dropdown = createDOMElement('div', 'dropdown');
    dropdownToggle.appendChild(selectedCharacter);
    dropdownToggle.appendChild(characterContent);
    dropdown.appendChild(dropdownToggle);
    parentDiv.appendChild(dropdown);

}

async function loadCharacterIncome(){
  const parentDiv = document.querySelector('.characterInfo');
  const characterIncomeDiv = createDOMElement('div', 'characterIncomeDiv');

  const Gold = await createImageElement(`../../public/assets/icons/menu/gold.webp`,'Gold Icon', 'goldIcon');
  const IncomeTextDiv = createDOMElement('div', 'IncomeTextDiv');
  const totalIncomeText = createDOMElement('span', 'totalIncomeText', 'Character Total Income');
  const totalIncome = Character.totalIncome.toLocaleString('en-US');

  const totalIncomeSpan = createDOMElement('span', 'characterTotalIncome', `${totalIncome}`);

  const fontSize = await adjustFontSizeToFit(totalIncome, 224, 32);
  totalIncomeSpan.style.fontSize = fontSize + 'px';

  IncomeTextDiv.appendChild(totalIncomeText);
  IncomeTextDiv.appendChild(totalIncomeSpan);
  characterIncomeDiv.appendChild(Gold);
  characterIncomeDiv.appendChild(IncomeTextDiv);

  parentDiv.appendChild(characterIncomeDiv);
  
}

function createCheckSVG(){
    const checkSVG = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    checkSVG.setAttribute('width', '40');
    checkSVG.setAttribute('height', '40');
    checkSVG.setAttribute('viewBox', '0 0 36 27');
    checkSVG.setAttribute('fill', 'none');
  
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'M12 21.4L3.59999 13L0.799988 15.8L12 27L36 2.99995L33.2 0.199951L12 21.4Z');
    path.setAttribute('fill', '#3D3D3D');
  
    checkSVG.appendChild(path);
    return checkSVG;
}

async function createArrowSVG() {
    const svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svgElement.setAttribute("id", "icon");
    svgElement.setAttribute("width", "48px");
    svgElement.setAttribute("height", "48px");
    svgElement.setAttribute("viewBox", "0 0 1024 1024");
    svgElement.setAttribute("class", "icon");
  
    const pathElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
    pathElement.setAttribute("d", "M917.333333 364.8L851.2 298.666667 512 637.866667 172.8 298.666667 106.666667 364.8 512 768z");
    pathElement.setAttribute("fill", "#3D3D3D");
    svgElement.appendChild(pathElement);
    return svgElement;
}
  
async function createCharacterButton(character) {

    const characterButton = createDOMElement('button', 'characterButton');
    const imgSource = `../../public/assets/buttom_profile/${character.code}.webp`;
    characterImage = await createImageElement(imgSource, 'character Profile', 'profile');
    characterName = createDOMElement('span', 'characterName',`${character.name}`);
    characterClass = createDOMElement('span', 'characterClass', `${character.class}`);

    characterWrapper = createDOMElement('div', 'characterWrapper');
  
    characterWrapper.appendChild(characterName);
    characterWrapper.appendChild(characterClass);

    characterButton.appendChild(characterImage);
    characterButton.appendChild(characterWrapper);

    return characterButton;

}

async function loadBosses(){
    const parentDiv = document.querySelector('.bosses');


    const jsonPath = '../../../public/data/bosses.json';
    bossJson = await fetch(jsonPath).then((response) => response.json());
    const bossGrid = createDOMElement('div', 'bossGrid');
    for(const boss of bossJson){
      const checkedBoss = Character.bosses.filter((obj) => obj.name === boss.name);

      const bossSlot = createDOMElement('div', 'bossSlot');
      const bossBox = createDOMElement('div', 'bossBox');
      const image = await createImageElement(boss.img, `${boss.name}` ,'bossPicture');
      const name = createDOMElement('span', 'bossName', boss.name);
      const fontSize = await adjustFontSizeToFit(boss.name, 126, 32);
      name.style.fontSize = fontSize + 'px';
      
      bossBox.appendChild(image);
      bossBox.appendChild(name);
      const buttonDiv = createDOMElement('div', 'buttonDiv');
      for(difficult of boss.difficulties){
        const difficultyFound = checkedBoss.filter((obj) => obj.difficulty === difficult.name);

        let classTag;
        let innerText;
        [classTag, innerText] = returnTagAndText(classTag, innerText, difficult.name);

        difficultButton = createDOMElement('button',  `${classTag}`);
        difficultButtonText = createDOMElement('span', 'buttonText',`${innerText}`);
        difficultButton.appendChild(difficultButtonText);

        difficultButton.setAttribute('value', `${difficult.value}`);
        difficultButton.setAttribute('reset', `${difficult.reset}`);
        difficultButton.setAttribute('name',  `${innerText}`);

        const LevelRequirmentOK = (Character.level > difficult.minLevel);
        if(!LevelRequirmentOK){
          updateButtonToBlock(difficultButton, difficult.minLevel);
        }

        if(difficult.reset === 'Daily' && LevelRequirmentOK){
          const dailyTotal = difficultyFound[0] !== undefined ? difficultyFound[0].DailyTotal : 0;
          insertDropdownOnButton(difficultButton, dailyTotal);
        }

        if (checkedBoss.length > 0) {
          
        
          if (difficultyFound.length > 0) {
            if(difficultyFound[0].reset !== 'Daily'){
              const difficultyColors = {
                Normal: '#3D3D3D',
                Hard: '#3D3D3D',
                Chaos: '#EDEDED',
                Extreme: '#E39294',
              };
              let color = difficultyColors[difficult.name];

              const checkMark = await createCheckMark(color);
              difficultButton.appendChild(checkMark);
            }   
          }
        }
        buttonDiv.appendChild(difficultButton);
      }
      bossBox.append(buttonDiv);

      bossSlot.appendChild(bossBox);
      bossGrid.appendChild(bossSlot);
    }
    parentDiv.appendChild(bossGrid);
}

function returnTagAndText(classTag, innerText, difficult) {
  switch (difficult) {
    case 'Easy':
      classTag = 'easyButton';
      innerText = 'Easy';
      break;

    case 'Normal':
      classTag = 'normalButton';
      innerText = 'Normal';
      break;

    case 'Hard':
      classTag = 'hardButton';
      innerText = 'Hard';
      break;

    case 'Chaos':
      classTag = 'chaosButton';
      innerText = 'Chaos';
      break;

    case 'Extreme':
      classTag = 'extremeButton';
      innerText = 'Extreme';
      break;
  }

  return [classTag, innerText];
}

async function updateButtonToBlock(difficultButton, minLevel){
  difficultButton.textContent = '';
  const color = '#C33232';
  const blockMark = await createBlockMark(color);
  difficultButton.appendChild(blockMark);

  difficultButton.classList.add('blocked');
  difficultButton.setAttribute('minLevel', minLevel);
}
async function createCheckMark(color){
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "20");
  svg.setAttribute("height", "20");
  svg.setAttribute("viewBox", "0 0 40 40");
  svg.setAttribute("fill", "none");

  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", "M20 0C8.96 0 0 8.96 0 20C0 31.04 8.96 40 20 40C31.04 40 40 31.04 40 20C40 8.96 31.04 0 20 0ZM16 30L6 20L8.82 17.18L16 24.34L31.18 9.16L34 12L16 30Z");
  path.setAttribute("fill", color);

  svg.appendChild(path);

  return svg;

}

async function createBlockMark(color){
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "20");
  svg.setAttribute("height", "20");
  svg.setAttribute("viewBox", "0 0 40 40");
  svg.setAttribute("fill", "none");

  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", "M20 0C8.96 0 0 8.96 0 20C0 31.04 8.96 40 20 40C31.04 40 40 31.04 40 20C40 8.96 31.04 0 20 0ZM4 20C4 11.16 11.16 4 20 4C23.7 4 27.1 5.26 29.8 7.38L7.38 29.8C5.26 27.1 4 23.7 4 20ZM20 36C16.3 36 12.9 34.74 10.2 32.62L32.62 10.2C34.74 12.9 36 16.3 36 20C36 28.84 28.84 36 20 36Z");
  path.setAttribute("fill", color);

  svg.appendChild(path);

  return svg;

}

function insertDropdownOnButton(difficultButton, DailyTotal){
  const dropdown = createDOMElement('select', 'dailyDropdown');
  const dropdownWrapper = createDOMElement('div', 'dropdownWrapper');
  const name = difficultButton.getAttribute('name');

  const [color, backgroundColor] = getColor(name);
  for(let i=0; i<= 7; i++){
    const option = createDOMElement('option');
    option.text = i > 0 ? `${i}x a Week` : `${i}`;
    option.value = i;
    option.style.color = color;
    option.style.backgroundColor = backgroundColor;
    
    dropdown.appendChild(option);
  }



  dropdown.style.color = color;
  dropdown.style.backgroundColor = backgroundColor;
  dropdown.value = DailyTotal;
  dropdown.setAttribute('difficult', `${difficultButton.name}`);

  dropdownWrapper.appendChild(dropdown);
  difficultButton.appendChild(dropdownWrapper);
}

function getColor(name){
  let color;
  let backgroundColor;

  switch (name) {
    case 'Easy':
      color = "#EDEDED";
      backgroundColor = "#9B9B9B";
      break;

    case 'Normal':
      color = '#3D3D3D';
      backgroundColor = '#91C9E3';
      break;

    case 'Hard':
      color = '#3D3D3D';
      backgroundColor = '#E39294';
      break;

    case 'Chaos':
      color = '#EDEDED';
      backgroundColor = '#3D3D3D';
      break;
  }

  return [color, backgroundColor];
}


async function loadMissingCharacter(){
  characterSelector = document.querySelector('.characterSelector');
  characterSelector.remove();

  parentDiv = document.querySelector('.bosses');
  warningSVG = await loadWarningSVG();
  warningText = createDOMElement('span', 'warningText', 'No bossing character selected!');
  warningDiv = createDOMElement('div', 'warningDiv');

  warningDiv.appendChild(warningSVG);
  warningDiv.appendChild(warningText);
  parentDiv.appendChild(warningDiv);
}

async function loadWarningSVG(){
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "420");
  svg.setAttribute("height", "420");
  svg.setAttribute("viewBox", "0 0 507 507");

  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", "M253.5 0.583374C113.89 0.583374 0.583496 113.89 0.583496 253.5C0.583496 393.11 113.89 506.417 253.5 506.417C393.11 506.417 506.417 393.11 506.417 253.5C506.417 113.89 393.11 0.583374 253.5 0.583374ZM278.792 379.958H228.209V329.375H278.792V379.958ZM278.792 278.792H228.209V127.042H278.792V278.792Z");
  path.setAttribute("fill", "#D4D4D4");
  
  svg.appendChild(path);
  return svg;
}


function createDOMElement(tag, className = '', content = '') {
const element = document.createElement(tag);

if (className) {
  element.classList.add(className);
}

if (content !== '') {
  element.textContent = content;
}

return element;
}

async function createImageElement(src, alt, className = '') {
const image = createDOMElement('img', className);
image.src = src;
image.alt = alt;

await image.decode();
return image;
}


function setCookie(name, value, days) {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
  
    // Check if the cookie is 'selectedServerContent'
    const path = name === 'selectedServerContent' ? '/' : '';
  
    document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=${path}`;
}
  
function getCookie(name) {
  const cookieArr = document.cookie.split(';');
  for (let i = 0; i < cookieArr.length; i++) {
    const cookiePair = cookieArr[i].split('=');
    if (cookiePair[0].trim() === name) {
      return decodeURIComponent(cookiePair[1]);
    }
  }
  return null;
}

function swapContent(selectedButton, characterButton) {
  const selectedImage = selectedButton.querySelector('img');
  const selectedName = selectedButton.querySelector('.characterName');
  const selectedClass = selectedButton.querySelector('.characterClass');

  const characterImage = characterButton.querySelector('img');
  const characterName = characterButton.querySelector('.characterName');
  const characterClass = characterButton.querySelector('.characterClass');


  selectedImage.setAttribute('alt', characterName.textContent);
  selectedImage.src = characterImage.src;
  selectedName.textContent = characterName.textContent;
  selectedClass.textContent = characterClass.textContent;
  
}

function setupCharacterDropdownToggle() {
  const dropdownToggle = document.querySelector('.dropdownToggle');
  const svgIcon = dropdownToggle.querySelector('.icon');
  let isOpen = false;

  dropdownToggle.addEventListener('click', function() {
    isOpen = !isOpen;

    dropdownToggle.classList.toggle('open', isOpen);
    dropdownToggle.classList.toggle('closed', !isOpen);
    svgIcon.classList.toggle('rotate', isOpen);
  });
}

function setupCharacterButtonsEvent(){

  const characterButtons = document.querySelectorAll('.characterButton'); 
      
  characterButtons.forEach(characterButton => {
    characterButton.addEventListener('click', async () => {
      await handleCharacterButtonClick(characterButton, characterButtons);
    });
  });

}


async function handleCharacterButtonClick(characterButton, characterButtons) {
  const selectedCharacterButton = document.querySelector('.SelectedCharacterButton');
  characterButtons.forEach(button => {
    const checkSVG = button.querySelector('svg');
    if (button !== characterButton) {
      button.classList.add('not-checked');
      button.classList.remove('checked');
    }
    if(checkSVG){
      button.removeChild(checkSVG);
    }
  });
  
  swapContent(selectedCharacterButton, characterButton);
  characterButton.classList.toggle('not-checked');
  characterButton.classList.toggle('checked');

  checkSVG = createCheckSVG();
  characterButton.appendChild(checkSVG);
  changeCharacterIncome();
  updateBosses();
}

function setupBossesButtonEvent() {
  const body = document.body;
  const blockedButtons = document.querySelectorAll('.blocked');
  let blockedTooltip;

  blockedButtons.forEach(blockedButton => {
    blockedButton.addEventListener('mouseover', async () => {
      const buttonRect = blockedButton.getBoundingClientRect();
      blockedTooltip = await createBlockedTooltip(buttonRect, blockedButton.getAttribute('minLevel')); 
      body.appendChild(blockedTooltip);
    });

    blockedButton.addEventListener('mouseout', () => {
        body.removeChild(blockedTooltip); 
    });
  });

  const bossesButtons =  document.querySelectorAll('.easyButton, .normalButton, .hardButton, .chaosButton, .extremeButton');
  const filteredButtons = Array.from(bossesButtons).filter(bossesButtons => !bossesButtons.querySelector('select'));

  filteredButtons.forEach((button) => {
    button.addEventListener('click', async () => {
      await buttonClickedFunctional(button);
    });
  });


  const dailyDropdown = document.querySelectorAll('.dailyDropdown');
  dailyDropdown.forEach(dropdown => {
    dropdown.addEventListener('mouseover', async () => {
      dropdownExpand(dropdown, true);
    });
  
    dropdown.addEventListener('click', async () => {
      const newValue = dropdown.value;
      await updateBossValue(newValue, dropdown);
      await resetOtherDropdown(dropdown);
      dropdown.size = 0;
      dropdown.style.zIndex = '1';

    });
  
    dropdown.addEventListener('mouseout', async () => {
      dropdownExpand(dropdown, false);
    });
  }); 
}
function dropdownExpand(dropdown, expand = false){
  parentdiv = dropdown.parentNode;
  button = parentdiv.parentNode;
  buttonText = button.querySelector('span');
  buttonText.style.display = expand === true ? 'none' : 'block';
  dropdown.size =  expand === true ? dropdown.options.length : 0;
  dropdown.style.width = expand === true ? 'auto' : '25px';
  dropdown.style.zIndex = expand === true ? '10' : '1';
  
  parentdiv.style.justifyContent = 'center';

}

async function createBlockedTooltip(buttonRect, minLevel){
  const text = `Required Level: \n${minLevel}`;
  const tooltip = createDOMElement('div', 'blockedTooltip', text);
  tooltip.style.top = `${buttonRect.top + window.scrollY - 65}px`;
  tooltip.style.left = `${buttonRect.left + window.scrollX - 5}px` ;

  return tooltip;
}
async function buttonClickedFunctional(button){
  let parentDiv = button.parentNode;
  parentDiv = parentDiv.parentNode;
  const bossName = parentDiv.querySelector('span').innerText;
  const boss = bossJson.filter((boss)=> boss.name === bossName);
  const difficulty = button.getAttribute('name');
  const svgInsideButton = button.querySelector('svg');
  let newValue = 0;
  if(svgInsideButton){
    button.removeChild(svgInsideButton);
    const data = {
      newValue: newValue, 
      difficult: difficulty
    };
    insertBossOnList(boss, data);
  }
  else{
    newValue = 1;

    const difficultyColors = {
      Normal: '#3D3D3D',
      Hard: '#3D3D3D',
      Chaos: '#EDEDED',
      Extreme: '#E39294',
    };
    let color = difficultyColors[difficulty];
    const checkMark = await createCheckMark(color);
    button.appendChild(checkMark);
    const data = {
      newValue: newValue, 
      difficult: difficulty
    };
    insertBossOnList(boss, data);

  }  
}
async function updateBossValue(newValue, dropdown){
    let bossBox = dropdown;
    let button = dropdown;
    let foundButton = false; 

		const difficult = dropdown.getAttribute('difficult');
    while (bossBox && (!bossBox.classList.contains('bossBox') || !foundButton)) {
      bossBox = bossBox.parentNode;

      if (!foundButton) {
        if (button.nodeName === 'BUTTON') {
          foundButton = true;
        } else {
          button = button.parentNode;
        }
      }
    }
    const name = bossBox.querySelector('.bossName').textContent;
    const boss = bossJson.filter((boss)=> boss.name === name);
    const data = {
      newValue: newValue, 
      difficult: difficult
    };
    insertBossOnList(boss, data);
    changeCharacterIncome();
    
    //console.log(selectedList);
    //console.log(Character);
}
async function insertBossOnList(boss, data){
  const bossData = boss[0];
  const bossName = bossData.name;
  const difficultData = bossData.difficulties.find((difficulty) => difficulty.name === data.difficult);
  const value = server === 'Reboot' ? difficultData.value * 5 : difficultData.value;
  
  const foundBossIndex = Character.bosses.findIndex((searchBoss) => searchBoss.name === bossData.name && searchBoss.difficulty === data.difficult);

  if (foundBossIndex !== -1) {
    //boss found
		const foundDifficulty = Character.bosses[foundBossIndex];

    console.log(foundDifficulty);
    if(data.newValue > 0){
      //update value
      foundDifficulty.DailyTotal = data.newValue;
    }
    else{
      //remove
      Character.bosses.splice(foundBossIndex, 1);
    }

  }
  else{
    //boss not found
    if(difficultData.reset == 'Daily'){
      //Add Daily boss
      const bossToAdd = {
				name: bossName,
				difficulty: data.difficult,
				value: value,
				reset: difficultData.reset,
        DailyTotal: data.newValue,
				checked: false,
				date: null,
			};
      Character.bosses.push(bossToAdd);
    }
    else{
      //Add Not Daily boss
      const bossToAdd ={
        name: bossName,
        difficulty: data.difficult,
        value: value,
        reset: difficultData.reset,
        checked: false,
        date: null,
      }
      Character.bosses.push(bossToAdd);
    }
  }
  await updateCharacterTotalIncome();
  await updateTotalCharactersIncome();
  updateTotalSelected();
}
async function resetOtherDropdown(dropdown){
  let bossBox = dropdown;
  const difficult = dropdown.getAttribute('difficult');
  while (bossBox && !bossBox.classList.contains('bossBox')) {
    bossBox = bossBox.parentNode;
  }
  
  const allDropdown = bossBox.querySelectorAll('select');
  allDropdown.forEach(dropdown => {
    const difficultyAttribute = dropdown.getAttribute('difficult');
    if(difficultyAttribute !== difficult){
      const value = dropdown.value;
      if(value > 0){
        dropdown.value = 0;
        updateBossValue(0, dropdown);
      }
    }
  });
}
async function updateCharacterTotalIncome(){
  console.log(Character);
  let totalIncome = 0;
  for (const newBoss of Character.bosses) {
    let value = newBoss.reset == 'Daily' ? newBoss.value * newBoss.DailyTotal : Number(newBoss.value);
    totalIncome += value;
  }
  Character.totalIncome = totalIncome;
  await changeCharacterIncome();
}
async function changeCharacterIncome(){
  const SelectedCharacterButton = document.querySelector('.SelectedCharacterButton');
  const characterName = SelectedCharacterButton.querySelector('.characterName').innerText;

  Character = selectedList.characters.find(character => character.name === characterName);
  const totalIncomeValue = Character.totalIncome.toLocaleString('en-us');
  const TotalIncome = document.querySelector('.characterTotalIncome');
  const fontSize = await adjustFontSizeToFit(totalIncomeValue, 224, 32);
  TotalIncome.textContent = totalIncomeValue;
  TotalIncome.style.fontSize = fontSize + 'px';
}

async function updateTotalCharactersIncome(){
  const TotalIncome = document.querySelector('.TotalIncome');
  const newTotalIncome = await calculateTotalIncome();
  TotalIncome.innerText = newTotalIncome.toLocaleString('en-us');
}

async function updateBosses(){
  const bossesButtons =  document.querySelectorAll('.easyButton, .normalButton, .hardButton, .chaosButton, .extremeButton');
  console.log(Character);
}


async function updateTotalSelected(){
    const totalBosses = await calculateTotalBosses();
    const totalSelectedBosses = document.querySelector('.totalSelectedBosses');
    totalSelectedBosses.innerText = `${totalBosses}/180`;
}