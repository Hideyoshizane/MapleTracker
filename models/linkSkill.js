const Joi = require('joi');
const mongoose = require('mongoose');
const path = require('path');


const LinkSkill = mongoose.model('LinkSkill', new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    editable: false
  },
  image: {
    type: String,
    required: true,
    unique: true,
    editable: false
  },
  levels: [{
    level: {
      type: Number,
      required: true,
      editable: false
    },
    description:{
        type: String,
        required: true,
        editable: false
      }
  }]
})); 



LinkSkill.on('index', (err) => {
    if (err) console.error(err);
    LinkSkill.countDocuments((err, count) => {
      if (err) console.error(err);
      if (count === 0) {
        // Create default LinkSkill
        const defaultLinkSkill = [
          {
            name: 'Invincible Belief',
            image:  path.join(__dirname, '../assets/link_skill/warrior.webp'),
            levels:[
              {level: 1, description: 'Automatically activates when your health falls to 15% of your Max HP or below. Restores 20% of Max HP every 1 sec for 3 sec. Cooldown: 410 sec.' },
              {level: 2, description: 'Automatically activates when your health falls to 15% of your Max HP or below. Restores 23% of Max HP every 1 sec for 3 sec. Cooldown: 370 sec.' },
            ],
          },
          {
            name: 'Empirical Knowledge',
            image:  path.join(__dirname, '../assets/link_skill/mage.webp'),
            levels:[
              {level: 1, description: 'When attacking, has a 15% chance to identify the weakness of the enemy with the highest Max HP among those struck, granting you the following bonuses against them: Damage per Stack: +1%, Enemy DEF Ignored per Stack: +1%, Effect Duration: 10 sec, Stacks up to 3 times.' },
              {level: 2, description: 'When attacking, has a 17% chance to identify the weakness of the enemy with the highest Max HP among those struck, granting you the following bonuses against them: Damage per Stack: +1%, Enemy DEF Ignored per Stack: +1%, Effect Duration: 10 sec, Stacks up to 3 times.' },
            ],
          },
          {
            name: "Adventurer's Curiosity",
            image:  path.join(__dirname, '../assets/link_skill/bowman.webp'),
            levels:[
              {level: 1, description: 'Chance to add monsters to Monster Collection: +10%, Critical Rate: +3%.' },
              {level: 2, description: 'Chance to add monsters to Monster Collection: +15%, Critical Rate: +4%.' },
            ],
          },
          {
            name: "Thief's Cunning",
            image:  path.join(__dirname, '../assets/link_skill/thief.webp'),
            levels:[
              {level: 1, description: 'Upon debuffing an enemy, Damage: +3%. Duration: 10 sec. Cooldown: 20 sec.' },
              {level: 2, description: 'Upon debuffing an enemy, Damage: +6%. Duration: 10 sec. Cooldown: 20 sec.' },
            ],
          },
          {
            name: "Pirate Blessing",
            image:  path.join(__dirname, '../assets/link_skill/pirate.webp'),
            levels:[
              {level: 1, description: 'STR: +20, DEX: +20, INT: +20, LUK: +20, Max HP: +350, Max MP: +350, Damage Taken: -5%.' },
              {level: 2, description: 'STR: +30, DEX: +30, INT: +30, LUK: +30, Max HP: +525, Max MP: +525, Damage Taken: -7%.' },
            ],
          },
          {
            name: "Cygnus Blessing",
            image:  path.join(__dirname, '../assets/link_skill/cygnus.webp'),
            levels:[
              {level: 1, description: 'Attack Power and Magic ATT: +7, Abnormal Status Resistance: +2, All Elemental Resistance: +1%.' },
              {level: 2, description: 'Attack Power and Magic ATT: +9, Abnormal Status Resistance: +3, All Elemental Resistance: +3%.' },
            ],
          },
          {
            name: "Knight's Watch",
            image:  path.join(__dirname, '../assets/link_skill/mihile.webp'),
            levels:[
              {level: 1, description: 'Temporarily increases Status Resistance.Duration: 10 sec, Status Resistance: +100. Cooldown: 120 sec.' },
              {level: 2, description: 'Temporarily increases Status Resistance.Duration: 15 sec, Status Resistance: +100. Cooldown: 120 sec.' },
              {level: 3, description: 'Temporarily increases Status Resistance.Duration: 20 sec, Status Resistance: +100. Cooldown: 120 sec.' },
            ],
          },
          {
            name: "Combo Kill Blessing",
            image:  path.join(__dirname, '../assets/link_skill/aran.webp'),
            levels:[
              {level: 1, description: 'Combo Kill Marble EXP: +400% (permanently).' },
              {level: 2, description: 'Combo Kill Marble EXP: +650% (permanently).' },
              {level: 3, description: 'Combo Kill Marble EXP: +900% (permanently).' },
            ],
          },
          {
            name: "Rune Persistence",
            image:  path.join(__dirname, '../assets/link_skill/evan.webp'),
            levels:[
              {level: 1, description: 'Rune Duration: +30%.' },
              {level: 2, description: 'Rune Duration: +50%.' },
              {level: 3, description: 'Rune Duration: +70%.' },
            ],
          },
          {
            name: "Elven Blessing",
            image:  path.join(__dirname, '../assets/link_skill/mercedes.webp'),
            levels:[
              {level: 1, description: 'Returns you to Elluel (Cooldown: 1800 sec). Additional Effect: Permanently receive 10% additional EXP.' },
              {level: 2, description: 'Returns you to Elluel (Cooldown: 1800 sec). Additional Effect: Permanently receive 15% additional EXP.' },
              {level: 3, description: 'Returns you to Elluel (Cooldown: 1800 sec). Additional Effect: Permanently receive 20% additional EXP.' },
            ],
          },
          {
            name: "Phantom Instinct",
            image:  path.join(__dirname, '../assets/link_skill/phantom.webp'),
            levels:[
              {level: 1, description: 'Critical Rate +10%.' },
              {level: 2, description: 'Critical Rate +15%.' },
              {level: 3, description: 'Critical Rate +20%.' },
            ],
          },
          {
            name: "Light Wash",
            image:  path.join(__dirname, '../assets/link_skill/luminous.webp'),
            levels:[
              {level: 1, description: '10% of enemy DEF ignored.' },
              {level: 2, description: '15% of enemy DEF ignored.' },
              {level: 3, description: '20% of enemy DEF ignored.' },
            ],
          },
          {
            name: "Close Call",
            image:  path.join(__dirname, '../assets/link_skill/shade.webp'),
            levels:[
              {level: 1, description: 'Fatal Attack Survival Chance: 5%.' },
              {level: 2, description: 'Fatal Attack Survival Chance: 10%.' },
            ],
          },
          {
            name: "Spirit of Freedom",
            image:  path.join(__dirname, '../assets/link_skill/resistance.webp'),
            levels:[
              {level: 1, description: 'Grants 1 seconds of invincibility after being revived. Removed upon moving to another map.' },
              {level: 2, description: 'Grants 2 seconds of invincibility after being revived. Removed upon moving to another map.' },
            ],
          },
          {
            name: "Wild Rage",
            image:  path.join(__dirname, '../assets/link_skill/demon_avenger.webp'),
            levels:[
              {level: 1, description: 'Damage: +5%' },
              {level: 2, description: 'Damage: +10%' },
              {level: 3, description: 'Damage: +15%' },
            ],
          },
          {
            name: "Fury Unleashed",
            image:  path.join(__dirname, '../assets/link_skill/demon_slayer.webp'),
            levels:[
              {level: 1, description: 'When attacking Boss Monster- Damage: +10%, Additional Fury Absorption: 10' },
              {level: 2, description: 'When attacking Boss Monster- Damage: +15%, Additional Fury Absorption: 10' },
              {level: 3, description: 'When attacking Boss Monster- Damage: +20%, Additional Fury Absorption: 10' },
            ],
          },
          {
            name: "Hybrid Logic",
            image:  path.join(__dirname, '../assets/link_skill/xenon.webp'),
            levels:[
              {level: 1, description: 'All Stats: +5%' },
              {level: 2, description: 'All Stats: +10%' },
            ],
          },
          {
            name: "Iron Will",
            image:  path.join(__dirname, '../assets/link_skill/kaiser.webp'),
            levels:[
              {level: 1, description: 'Max HP: +10%' },
              {level: 2, description: 'Max HP: +15%' },
              {level: 3, description: 'Max HP: +20%' },
            ],
          },
          {
            name: "Time to Prepare",
            image:  path.join(__dirname, '../assets/link_skill/kain.webp'),
            levels:[
              {level: 1, description: "After completing Time to Prepare at least 1 time, then upon either defeating 8 enemies or attacking a boss 5 times, damage increases by 9% for 20 sec, for every 5 times you've stacked Time to Prepare. Cooldown: 40 sec" },
              {level: 2, description: "After completing Time to Prepare at least 1 time, then upon either defeating 8 enemies or attacking a boss 5 times, damage increases by 17% for 20 sec, for every 5 times you've stacked Time to Prepare. Cooldown: 40 sec" },
            ],
          },
          {
            name: "Unfair Advantage",
            image:  path.join(__dirname, '../assets/link_skill/cadena.webp'),
            levels:[
              {level: 1, description: "Attacks against weaker opponents deal +3% damage. Attacks against monsters afflicted by Abnormal Statuses deal +3% damage." },
              {level: 2, description: "Attacks against weaker opponents deal +6% damage. Attacks against monsters afflicted by Abnormal Statuses deal +6% damage." },
            ],
          },
          {
            name: "Terms and Conditions",
            image:  path.join(__dirname, '../assets/link_skill/angelic_buster.webp'),
            levels:[
              {level: 1, description: "+60% skill damage for 10 sec when active. Cooldown: 90 sec. Skill effects reduced to half when used with link skill." },
              {level: 2, description: "+90% skill damage for 10 sec when active. Cooldown: 90 sec. Skill effects reduced to half when used with link skill." },
              {level: 3, description: "+120% skill damage for 10 sec when active. Cooldown: 90 sec. Skill effects reduced to half when used with link skill." },
            ],
          },
          {
            name: "Noble Fire",
            image:  path.join(__dirname, '../assets/link_skill/adele.webp'),
            levels:[
              {level: 1, description: "Boss Damage: +2%. Increases damage by 1% up to 4% for each party member, including yourself, on the same map. If you are not in a party, you will be considered to be in your own party." },
              {level: 2, description: "Boss Damage: +4%. Increases damage by 2% up to 8% for each party member, including yourself, on the same map. If you are not in a party, you will be considered to be in your own party." },
            ],
          },
          {
            name: "Tide of Battle",
            image:  path.join(__dirname, '../assets/link_skill/illium.webp'),
            levels:[
              {level: 1, description: "Activated when moving a certain distance. Max number of stacks: 6 times, Duration: 5 sec, Damage per stack: +1%." },
              {level: 2, description: "Activated when moving a certain distance. Max number of stacks: 6 times, Duration: 5 sec, Damage per stack: +2%." },
            ],
          },
          {
            name: "Solus",
            image:  path.join(__dirname, '../assets/link_skill/ark.webp'),
            levels:[
              {level: 1, description: "Activates when the combat state continues for 5 sec. Can be stacked a max of 5 times. Duration: 5 sec. When activated, damage increases by 1%, and damage increases an extra 1% per stack." },
              {level: 2, description: "Activates when the combat state continues for 5 sec. Can be stacked a max of 5 times. Duration: 5 sec. When activated, damage increases by 1%, and damage increases an extra 2% per stack." },
              {level: 3, description: "Activates when the combat state continues for 5 sec. Can be stacked a max of 5 times. Duration: 5 sec. When activated, damage increases by 1%, and damage increases an extra 3% per stack." },
            ],
          },
          {
            name: "Keen Edge",
            image:  path.join(__dirname, '../assets/link_skill/hayato.webp'),
            levels:[
              {level: 1, description: "All Stats: 15, Attack Power Increase: 10, Magic Attack Power Increase: 10." },
              {level: 2, description: "All Stats: 25, Attack Power Increase: 15, Magic Attack Power Increase: 15." },
            ],
          },
          {
            name: "Elementalism",
            image:  path.join(__dirname, '../assets/link_skill/kanna.webp'),
            levels:[
              {level: 1, description: "Permanent Damage Increase: 5%." },
              {level: 2, description: "Permanent Damage Increase: 10%." },
            ],
          },
          {
            name: "Nature's Friend",
            image:  path.join(__dirname, '../assets/link_skill/lara.webp'),
            levels:[
              {level: 1, description: "Damage: +3%. Activate nature's help upon defeating 20 normal monsters. Increases Damage Against Normal Monsters by 7% for 30 sec. when nature's help is active.Cooldown: 30 sec." },
              {level: 2, description: "Damage: +5%. Activate nature's help upon defeating 20 normal monsters. Increases Damage Against Normal Monsters by 11% for 30 sec. when nature's help is active. Cooldown: 30 sec." },
            ],
          },
          {
            name: "Bravado",
            image:  path.join(__dirname, '../assets/link_skill/hoyoung.webp'),
            levels:[
              {level: 1, description: "Enemy DEF Ignored: +5%, Damage: +9% against enemies with 100% HP." },
              {level: 2, description: "Enemy DEF Ignored: +10%, Damage: +14% against enemies with 100% HP." },
            ],
          },
          {
            name: "Focus Spirit",
            image:  path.join(__dirname, '../assets/link_skill/beast_tamer.webp'),
            levels:[
              {level: 1, description: "Boss Damage: +4%. Critical Rate: +4%. Max HP +3%. Max MP: +3%." },
              {level: 2, description: "Boss Damage: +7%. Critical Rate: +7%. Max HP +4%. Max MP: +4%." },
              {level: 3, description: "Boss Damage: +10%. Critical Rate: +10%. Max HP +5%. Max MP: +5%." },
            ],
          },
          {
            name: "Rhinne's Blessing",
            image:  path.join(__dirname, '../assets/link_skill/zero.webp'),
            levels:[
              {level: 1, description: "Incoming damage reduced: 3%, defense ignored: 2%." },
              {level: 2, description: "Incoming damage reduced: 6%, defense ignored: 4%." },
              {level: 3, description: "Incoming damage reduced: 9%, defense ignored: 6%." },
              {level: 4, description: "Incoming damage reduced: 12%, defense ignored: 8%." },
              {level: 5, description: "Incoming damage reduced: 15%, defense ignored: 10%." },
            ],
          },
          {
            name: "Judgment",
            image:  path.join(__dirname, '../assets/link_skill/kinesis.webp'),
            levels:[
              {level: 1, description: "Critical Damage: +2%." },
              {level: 2, description: "Critical Damage: +4%." },
            ],
          },
        ];
        LinkSkill.insertMany(defaultLinkSkill, (err, docs) => {
          if (err) console.error(err);
          console.log('Default Link Skill created:', docs);
        });
      }
    });
  });


  module.exports = {LinkSkill};

