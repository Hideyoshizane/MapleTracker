const path = window.location.pathname;
const segments = path.split('/');
const username = segments[1];
const server = segments[2];
const characterCode = segments[3];
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch(`/code/${username}/${server}/${characterCode}`);
        const characterData = await response.json();
        await loadCharacterImage(characterData);
        await loadTopButtons();
        await loadCharacterNameDiv(characterData);
        await loadLevelAndLevelBar(characterData);
        await loadArcaneForce(characterData);
        await loadSacredForce(characterData);


    } catch(error){
        console.error('error loading page', error);
    }
}); 


async function loadCharacterImage(characterData) {
    const parentDiv = document.querySelector('.classImage');

    const image = document.createElement('img');
    image.src = `../../public/assets/profile/${characterData.code}.webp`;
    image.alt = `${characterData.class} profile picture`;
    image.className = 'portraitImage';

    parentDiv.appendChild(image);
};

async function loadTopButtons(){
    const parentDiv = document.querySelector('.characterData');

    const blockDiv = document.createElement('div');
    blockDiv.className = 'buttonWrapper';

    const increaseAllButon = document.createElement('div');
    increaseAllButon.className = 'increaseAllButton';
    increaseAllButon.innerText = 'Increase all';

    const editButton = document.createElement('div');
    editButton.className = 'editButton';
    editButton.innerText = 'Edit Character';


    blockDiv.appendChild(increaseAllButon);
    blockDiv.appendChild(editButton);
    parentDiv.appendChild(blockDiv);
}

async function loadCharacterNameDiv(characterData){
    const parentDiv = document.querySelector('.characterData');

    const characterInfo = document.createElement('div');
    characterInfo.className = 'nameLinkLegion';

    const bossIconpath = '../../public/assets/icons/menu/boss_slayer.svg';
    const bossIcon = await loadEditableSVGFile(bossIconpath);
    bossIcon.classList.add('bossIcon');

    const characterName = document.createElement('span');
    characterName.className = 'chracterName';
    characterName.innerText = characterData.name;

    const characterIconDiv = document.createElement('div');
    characterIconDiv.className = 'characterIconDiv';

    characterIconDiv.appendChild(bossIcon);
    characterIconDiv.appendChild(characterName);

    characterInfo.appendChild(characterIconDiv);

    const linkLegionClassJob = document.createElement('div');
    linkLegionClassJob.className = 'linkLegionClassJob';

    const linkSkill = await loadLinkSkillDiv(characterData);
    const legion = await loadLegionDiv(characterData);

    const JobType = document.createElement('span');
    JobType.className = 'classType';
    JobType.innerText = characterData.class;

    const JobLevel = document.createElement('span');
    JobLevel.className = 'jobLevel';
    JobLevel.innerText = characterData.job;

    const JobDiv = document.createElement('div');
    JobDiv.className = 'jobDiv';

    JobDiv.appendChild(JobType);
    JobDiv.appendChild(JobLevel);

    linkLegionClassJob.appendChild(linkSkill);
    linkLegionClassJob.appendChild(legion);
    linkLegionClassJob.appendChild(JobDiv);
    
    characterInfo.appendChild(linkLegionClassJob);
    parentDiv.appendChild(characterInfo);
}



async function loadEditableSVGFile(filePath) {
  try {
    const response = await fetch(filePath);
    const svgData = await response.text();

    const svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
   
    svgElement.innerHTML = svgData;

    return svgElement;

  } catch (error) {
    console.error("Error loading SVG file:", error);
    return null;
  }
}

async function loadLinkSkillDiv(characterData){
  const linkspan = document.createElement('span');
  linkspan.className = 'linkLegionTitle';
  linkspan.innerText = 'Link Skill';

  linkSkillData = await fetch('../../public/data/linkskill.json').then(response => response.json());
  filteredLink = linkSkillData.find(item => item.name === characterData.linkSkill);

  const linkImg = document.createElement('img');
  linkImg.alt = filteredLink.name;
  linkImg.src = filteredLink.image;
  linkImg.className = 'linkImg';

  const linkSkillBlock = document.createElement('div');
  linkSkillBlock.className = 'linkSkillBlock';

  linkSkillBlock.appendChild(linkspan);
  linkSkillBlock.appendChild(linkImg);

  return linkSkillBlock;

}

async function loadLegionDiv(characterData) {
  legionData = await fetch('../../public/data/legionsystems.json').then(response => response.json());
  filterLegion = legionData.find(item => item.name === characterData.legion);

  const legionspan = document.createElement('span');
  legionspan.className = 'linkLegionTitle';
  legionspan.innerText = 'Legion';

  const legionImg = document.createElement('img');
  legionImg.className = 'legionImg';
  legionImg.alt = `${characterData.class} legion`;

  let legionRank = getRank(characterData);
  if(legionRank == 'no_rank'){
    legionImg.src = '../../public/assets/legion/no_rank.webp';
  }
  else{
    legionImg.src = `../../public/assets/legion/${characterData.jobType}/rank_${legionRank}.webp`;
  }

  const legionBlock = document.createElement('div');
  legionBlock.className = 'legionBlock';

  legionBlock.appendChild(legionspan);
  legionBlock.appendChild(legionImg);

  return legionBlock;
}

function getRank(characterData) {
  const { level, code } = characterData;

  if (code === 'zero') {
    if (level >= 130 && level <= 159) return 'b';
    if (level >= 160 && level <= 179) return 'a';
    if (level >= 180 && level <= 199) return 's';
    if (level >= 200 && level <= 249) return 'ss';
    if (level >= 250) return 'sss';
  } else {
    if (level >= 60 && level <= 99) return 'b';
    if (level >= 100 && level <= 139) return 'a';
    if (level >= 140 && level <= 199) return 's';
    if (level >= 200 && level <= 249) return 'ss';
    if (level >= 250) return 'sss';
  }

  return 'no_rank';
}

async function loadLevelAndLevelBar(characterData){
  const parentDiv = document.querySelector('.characterData');

  const level = document.createElement('span');
  level.className = 'level';
  level.innerText = 'Level';

  const levelNumber = document.createElement('span');
  levelNumber.className = 'levelNumber';
  levelNumber.innerText = `${characterData.level}/${characterData.targetLevel}`;

  const levelDiv = document.createElement('div');
  levelDiv.className = 'levelDiv';

  const levelBar = await levelBarCreation(characterData);

  levelDiv.appendChild(level);
  levelDiv.appendChild(levelNumber);

  parentDiv.appendChild(levelDiv);
  parentDiv.appendChild(levelBar);
}

async function levelBarCreation(characterData) {

  const outerDiv = document.createElement('div');
  outerDiv.className = 'outerLevelBar';
  outerDiv.style.width = '800px';
  outerDiv.style.height = '32px';

  const innerDiv = document.createElement('div');
  innerDiv.className = 'innerLevelBar';

  if(characterData.level == 0){
    innerDiv.style.width = 0;
  }
  else{
    const maxWidth = 796;
    let BarSize = (characterData.level / characterData.targetLevel) * maxWidth;

    if(BarSize > maxWidth){
      BarSize = maxWidth;
    }
    innerDiv.style.width = BarSize + 'px';
  }
  setStyle(innerDiv, characterData);
  outerDiv.appendChild(innerDiv);

  return outerDiv;
}

function setStyle(element, characterData) {
  let value;

  switch (characterData.jobType) {
    case 'mage':
      value = '#92BCE3';
      break;

    case 'thief':
    case 'xenon':
      value = '#B992E3';
      break;
    
    case 'warrior':
      value = '#E39294';
      break;

    case 'bowman':
      value = '#96E4A5';
      break;

    case 'pirate':
      value = '#E3C192';
      break;
  }

  if (characterData.level >= characterData.targetLevel) {
    value = '#48AA39';
  }

  element.style.backgroundColor = value;
}

async function loadArcaneForce(characterData){
  const parentDiv = document.querySelector('.characterData');

  const Title = document.createElement('span');
  Title.className = 'ArcaneForce';
  Title.innerText = 'Arcane Force';

  const arcaneForceDiv = document.createElement('div');
  arcaneForceDiv.className = 'arcaneForceDiv';
  arcaneForceDiv.appendChild(Title);

  const arcaneGrid = document.createElement('div');
  arcaneGrid.className = 'arcaneGrid';

  for(arcaneForce of characterData.ArcaneForce) {
    const arcaneForceWrapper = document.createElement('div');
    arcaneForceWrapper.className = 'arcaneForceWrapper';

    const areaName = arcaneForce.name;
    const areaCode = areaName.replace(/\s+/g, '_').toLowerCase();
    let arcaneForceLevel = arcaneForce.level;

    const icon = document.createElement('img');
    icon.src = `../../public/assets/arcane_force/${areaCode}.webp`;
    icon.alt = areaName;
    icon.className = `ArcaneImage`;

    if(characterData.level < arcaneForce.minLevel){
      icon.classList.add('off');
      arcaneForceLevel = 0;
    }

    arcaneForceWrapper.appendChild(icon);
    const jsonPath = '../../public/data/arcaneforceexp.json';
    const expTable = await (await fetch(jsonPath)).json();
    
    const levelWrapper = document.createElement('div');
    levelWrapper.className = 'levelWrapper';

    const level = document.createElement('span');
    level.className = 'ArcaneLevel';
    level.innerText = `Level: ${arcaneForceLevel}`;
    level.setAttribute('level', arcaneForceLevel);

    levelWrapper.appendChild(level);  

    if(characterData.level >= arcaneForce.minLevel){
      const expContent = createExpText(arcaneForce, expTable);
      levelWrapper.appendChild(expContent);
    }
    
    const expBar = await createBar(arcaneForce, expTable, characterData, true);

    const arcaneData = document.createElement('div');
    arcaneData.className = 'arcaneData';
    arcaneData.appendChild(levelWrapper);
    arcaneData.appendChild(expBar);

    if(characterData.level >= arcaneForce.minLevel){
      const daysToMax = await returnDaysToMax(arcaneForce, expTable,characterData, true); 
      const wrap = document.createElement('div');
      wrap.style.display = 'flex';
      wrap.style.justifyContent = 'space-between';

      const dailyButton = createDailyButton(arcaneForce, characterData, true);
      const weeklyButton = createWeeklyButton(arcaneForce);

      wrap.appendChild(dailyButton);
      wrap.appendChild(weeklyButton);

      arcaneData.appendChild(daysToMax);
      arcaneData.appendChild(wrap);
    }
    else{
      const unlockText = document.createElement('span');
      unlockText.className = 'unlockText';
      unlockText.innerText = `Unlock at Level ${arcaneForce.minLevel}`;
      arcaneData.appendChild(unlockText);
    }


    arcaneForceWrapper.appendChild(arcaneData);

    arcaneGrid.appendChild(arcaneForceWrapper);
  }

  arcaneForceDiv.appendChild(arcaneGrid);
  parentDiv.appendChild(arcaneForceDiv);
}

async function loadSacredForce(characterData){
  const parentDiv = document.querySelector('.characterData');

  const Title = document.createElement('span');
  Title.className = 'SacredForce';
  Title.innerText = 'Sacred Force';

  const sacredForceDiv = document.createElement('div');
  sacredForceDiv.className = 'sacredForceDiv';
  sacredForceDiv.appendChild(Title);

  const sacredGrid = document.createElement('div');
  sacredGrid.className = 'sacredGrid';

  for(sacredForce of characterData.SacredForce){
    const sacredForceWrapper = document.createElement('div');
    sacredForceWrapper.className = 'sacredForceWrapper';

    const areaName = sacredForce.name;
    const areaCode = areaName.replace(/\s+/g, '_').toLowerCase();
    let sacredForceLevel = sacredForce.level;

    const icon = document.createElement('img');
    icon.src = `../../public/assets/sacred_force/${areaCode}.webp`;
    icon.alt = areaName;
    icon.className = `SacredImage`;

    if(characterData.level < sacredForce.minLevel){
      icon.classList.add('off');
      sacredForceLevel = 0;
    }

    sacredForceWrapper.appendChild(icon);
    
    const jsonPath = '../../public/data/sacredforceexp.json';
    const expTable = await (await fetch(jsonPath)).json();
    
    const levelWrapper = document.createElement('div');
    levelWrapper.className = 'levelWrapper';

    const level = document.createElement('span');
    level.className = 'SacredLevel';
    level.innerText = `Level: ${sacredForceLevel}`;
    level.setAttribute('level', sacredForceLevel);

    levelWrapper.appendChild(level);

    if(characterData.level >= sacredForce.minLevel){
      const expContent = createExpText(sacredForce, expTable);
      levelWrapper.appendChild(expContent);
    }
    
    const expBar = await createBar(sacredForce, expTable, characterData);

    const sacredData = document.createElement('div');
    sacredData.className = 'sacredData';
    sacredData.appendChild(levelWrapper);
    sacredData.appendChild(expBar);

    if(characterData.level >= sacredForce.minLevel){
      const daysToMax = await returnDaysToMax(sacredForce, expTable,characterData); 
      const wrap = document.createElement('div');
      wrap.style.display = 'flex';
      wrap.style.justifyContent = 'space-between';

      const dailyButton = createDailyButton(sacredForce, characterData, false);

      wrap.appendChild(dailyButton);

      sacredData.appendChild(daysToMax);
      sacredData.appendChild(wrap);
    }
    else{
      const unlockText = document.createElement('span');
      unlockText.className = 'unlockText';
      unlockText.innerHTML = `Unlock at Level ${sacredForce.minLevel}`;
      sacredData.appendChild(unlockText);
    }


    
    sacredForceWrapper.appendChild(sacredData);
    sacredGrid.appendChild(sacredForceWrapper);
  }


  sacredForceDiv.appendChild(sacredGrid);
  parentDiv.appendChild(sacredForceDiv);
}

function createExpText(Force, expTable){
    const exp = document.createElement('span');
    exp.className = 'exp';
    exp.innerText = 'EXP:';

    const nextLevelEXP = expTable.level[Force.level].EXP;
    
    const expNumber = document.createElement('span');
    expNumber.className = 'expNumber';
    expNumber.innerText = `${Force.exp}/${nextLevelEXP}`;
    expNumber.setAttribute('expAmount',Force.exp);
    expNumber.setAttribute('nextLevelEXP',nextLevelEXP);

    const wrap = document.createElement('div');

    wrap.appendChild(exp);
    wrap.appendChild(expNumber);

    return wrap;
}
async function createBar(Force, expTable, characterData, isArcane = false){
  const nextLevelEXP = expTable.level[Force.level].EXP;

  const outerEXPBar = document.createElement('div');
  outerEXPBar.className = 'outerEXPBar';
  outerEXPBar.style.width = '195px';
  outerEXPBar.style.height = '8px';
  outerEXPBar.style.backgroundColor = 'black';

  const innerEXPBar = document.createElement('div');
  innerEXPBar.className = 'innerEXPBar';
  innerEXPBar.style.height = '4px';

  if(characterData.level < Force.minLevel){
    innerEXPBar.style.width = 0;
  }
  else{
    const maxWidth = 191;
    let BarSize = (Force.exp / nextLevelEXP) * maxWidth;
    
    BarSize = (BarSize > maxWidth || (isArcane && Force.level === 20) || (!isArcane && Force.level === 11)) ? maxWidth : BarSize;

    innerEXPBar.style.width = BarSize + 'px';
  }
  setStyle(innerEXPBar, characterData);

  outerEXPBar.appendChild(innerEXPBar);
  return outerEXPBar;
}


async function returnDaysToMax(Force, expTable, characterData, isArcane = false){
  const forceLevel = Force.level;

  let totalExp = 0;
  let dailyExp = 0;
  for (let level = forceLevel; level <= Object.keys(expTable.level).length; level++) {
    if (expTable.level[level]) {
      totalExp += expTable.level[level].EXP;
    }
  }
  totalExp -= Force.exp;
    dailyExp = getDailyValue(Force, characterData, isArcane);

  let weeklyExp;
  if(Force.content[1].checked == true && isArcane){
    weeklyExp = 45;
  } else{
    weeklyExp = 0;
  }
  const daysToReachTotalExp = Math.ceil(totalExp / (dailyExp + (weeklyExp / 7)));
  
  const daysToMax = document.createElement('span');
  daysToMax.className = 'daysToMax';
  if(isArcane){
    daysToMax.innerText = `Days to Level 20: ${daysToReachTotalExp}`;
  }
  else{
    daysToMax.innerText = `Days to Level 11: ${daysToReachTotalExp}`;
  }
  

  return daysToMax;
}

function createDailyButton(Force, characterData, isArcane = false){
  const dailyValue = getDailyValue(Force, characterData, isArcane);
  const dailyButton = document.createElement('div');
  dailyButton.className = 'dailyButton';
  dailyButton.innerText = `Daily: + ${dailyValue}`
  dailyButton.setAttribute('value', dailyValue);
  return dailyButton;
}

function getDailyValue(Force, characterData, isArcane = false){
  let dailyValue = Force.content[0].expGain;

  if(isArcane){
    if(Force.content[2] && Force.content[2].checked == true){
      if(characterData.level >= Force.content[2].minLevel){
        dailyValue *= 2;
      }
    }
  }
      
  if(!isArcane && Force.name === 'Cernium'){
    if(Force.content[1].checked == true){
      dailyValue += Force.content[1].expGain;
    }
  }
  return dailyValue;
}

function createWeeklyButton(Force){
  const weeklyButton = document.createElement('div');
  weeklyButton.className = 'weeklyButton';
  weeklyButton.innerText = `Weekly: ${Force.content[1].tries}/3`

  return weeklyButton;
}