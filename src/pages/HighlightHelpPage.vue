<template>
  <main>
    <h1><Search />Query Help</h1>
    <p class="center">A variety of search parameters can be used to find cards.</p>
    <div class="topic-container">
      <RouterLink
        v-for="(icon, name) in categories"
        :key="name"
        :to="{ hash: `#${name.toLowerCase()}` }"
      >
        <Button :label="name">
          <template #icon="iconClass">
            <component :is="icon" :class="iconClass.class"></component>
          </template>
        </Button>
      </RouterLink>
    </div>
    <Divider />
    <h2 id="name"><component :is="categories.Name" />Name</h2>
    <p>
      Type the card name or parts of a card name to find those cards. Each word is evaluated
      separately and is case insensitive. For example,
      <code>Sun flower</code> and <code>Flower sun</code> will produce the same results, cards
      containing the word <strong>Sun</strong> and the word <strong>Flower</strong>.
    </p>
    <p>
      To restrict the search to cards that contain a phrase including the spaces, the name can be
      put within double quotes ("). For example, <code>"ing zombie"</code> will exclude the
      <strong>Zombie King</strong> because it does not contain the exact phrase.
    </p>
    <NotePanel type="error">
      <p>
        If a phrase is used but there is no ending double quote, the phrase will contain everything
        up until the end of the query. For example,
        <code>"ing zombie</code> will still work to find all cards with the phrase
        <strong>ing zombie</strong> in their name. However, if you accidentally left out a double
        quote but have another property after it, the query will likely not work as intended. For
        example, <code>"ing zombie haunting</code> will not find the
        <strong>Haunting Zombie</strong> but <code>"ing zombie" haunting</code> will.
      </p></NotePanel
    >
    <Divider />

    <h2 id="cost"><component :is="categories.Cost" />Cost</h2>
    <p>
      To find cards that cost a certain amount to play, you can type
      <code>cost:3</code> or <code>cost=3</code>. Alternatively, you can use
      <code>cost&lt;3</code> for all cards that cost less than 3, <code>cost&gt;3</code> for all
      cards that cost greater than 3, <code>cost&lt;=3</code> for all cards that cost less than or
      are equal to 3, and <code>cost&gt;=3</code> for all cards that cost grater than or equal to 3.
    </p>
    <NotePanel type="tip">
      <p>
        The short form for the <code>cost</code> parameter is <code>c</code>, so the following terms
        are equivalent: <code>cost:3</code> and <code>c:3</code>.
      </p>
    </NotePanel>
    <NotePanel type="tip">
      <p>
        To combine criteria, you can join the terms with a space between them. For example, to find
        all cards with
        <strong>nut</strong> in their name and that cost over 2, you can use
        <code>nut cost>2</code>.
      </p>
    </NotePanel>
    <NotePanel type="error">
      <p>If the value of the <code>cost</code> parameter is not a number, it will be ignored.</p>
    </NotePanel>
    <Divider />

    <h2 id="strength"><component :is="categories.Strength" />Strength</h2>
    <p>
      To find cards that match a strength, you can type
      <code>strength:3</code> or <code>strength=3</code>. Alternatively, you can use
      <code>strength&lt;3</code> for all cards that are weaker than 3,
      <code>strength&gt;3</code> for all cards that are stronger than 3,
      <code>strength&lt;=3</code> for all cards that are weaker than or have a strength equal to 3,
      and <code>strength&gt;=3</code> for all cards that are stronger than or have a strength equal
      to 3.
    </p>
    <NotePanel type="tip">
      <p>
        The short form for the <code>strength</code> parameter is <code>s</code>, so the following
        terms are equivalent: <code>strength:3</code> and <code>s:3</code>.
      </p>
    </NotePanel>
    <NotePanel type="note">
      <p>
        If the <code>strength</code> parameter is present, even for <code>strength:0</code>, no
        tricks or environments will be found.
      </p>
    </NotePanel>
    <NotePanel type="error">
      <p>
        If the value of the <code>strength</code> parameter is not a number, it will be ignored.
      </p>
    </NotePanel>
    <Divider />

    <h2 id="health"><component :is="categories.Health" />Health</h2>
    <p>
      To find cards that match a health, you can type
      <code>health:3</code> or <code>health=3</code>. Alternatively, you can use
      <code>health&lt;3</code> for all cards that have a less health than 3,
      <code>health&gt;3</code> for all cards that have greater health than 3,
      <code>health&lt;=3</code> for all cards that have less health than or equal to 3, and
      <code>health&gt;=3</code> for all cards that have greater health than or equal to 3.
    </p>
    <NotePanel type="tip">
      <p>
        The short form for the <code>health</code> parameter is <code>h</code>, so the following
        terms are equivalent: <code>health:3</code> and <code>h:3</code>.
      </p>
    </NotePanel>
    <NotePanel type="note">
      <p>
        If the <code>health</code> parameter is present, even for <code>health:0</code>, no tricks
        or environments will be found.
      </p>
    </NotePanel>
    <NotePanel type="error">
      <p>If the value of the <code>health</code> parameter is not a number, it will be ignored.</p>
    </NotePanel>
    <Divider />

    <h2 id="is"><component :is="categories.Is" />Is</h2>
    <p>
      To find cards that are plants, you can use
      <code>is:plant</code>. The valid values for the <code>is</code> parameter can be used
      case-insensitively and include the following with their short forms:
    </p>
    <DataTable :value="isValues" size="small" stripedRows>
      <Column field="regular" header="Regular"></Column>
      <Column field="short" header="Short Form"></Column>
    </DataTable>
    <p>
      Short forms are used the same way as the regular forms. For example,
      <code>is:zombie</code> is the same as <code>is:z</code>.
    </p>
    <NotePanel type="error">
      <p>If the value of the <code>is</code> parameter is not valid, it will be ignored.</p>
    </NotePanel>
    <Divider />

    <h2 id="set"><component :is="categories.Set" />Set</h2>
    <p>
      To find cards that were released in a set, you can use
      <code>set:premium</code>. The valid values for the <code>set</code> parameter can be used
      case-insensitively and include the following with their short forms:
    </p>
    <DataTable :value="setValues" size="small" stripedRows>
      <Column field="regular" header="Regular"></Column>
      <Column field="short" header="Short Form"></Column>
    </DataTable>
    <p>
      Short forms are used the same way as the regular forms. For example,
      <code>set:premium</code> is the same as <code>set:p</code>.
    </p>
    <NotePanel type="error">
      <p>If the value of the <code>set</code> parameter is not valid, it will be ignored.</p>
    </NotePanel>
    <Divider />

    <h2 id="rarity"><component :is="categories.Rarity" />Rarity</h2>
    <p>
      To find cards of a rarity, you can use
      <code>rarity:rare</code>. The valid values for the <code>rarity</code> parameter can be used
      case-insensitively and include the following with their short forms:
    </p>
    <DataTable :value="rarityValues" size="small" stripedRows>
      <Column field="regular" header="Regular"></Column>
      <Column field="short" header="Short Form"></Column>
    </DataTable>
    <p>
      Short forms are used the same way as the regular forms. For example,
      <code>rarity:rare</code> is the same as <code>rarity:r</code>.
    </p>
    <NotePanel type="tip">
      <p>
        The short form for the <code>rarity</code> parameter is <code>r</code>, so the following
        terms are equivalent: <code>rarity:rare</code> and <code>r:rare</code>.
      </p>
    </NotePanel>
    <NotePanel type="note">
      <p>
        The <code>superrare</code> value can also be written with a space,
        <code>rarity:"super rare"</code>, or hyphen, <code>rarity:super-rare</code>.
      </p>
    </NotePanel>
    <NotePanel type="error">
      <p>If the value of the <code>rarity</code> parameter is not valid, it will be ignored.</p>
    </NotePanel>
    <Divider />

    <h2 id="class"><component :is="categories.Class" />Class</h2>
    <p>
      To find cards of a class, you can use
      <code>class:solar</code>. The valid values for the <code>class</code> parameter can be used
      case-insensitively and include the following:
    </p>
    <DataTable :value="classValues" size="small" stripedRows>
      <Column field="regular" header="Regular"></Column>
    </DataTable>
    <NotePanel type="note">
      <p>
        The <code>megagrow</code> value can also be written with a space,
        <code>class:"mega grow"</code>, or hyphen, <code>class:mega-grow</code>.
      </p>
    </NotePanel>
    <NotePanel type="warning">
      <p>
        If there are multiple classes specified, <code>class:solar class:smarty</code>, cards with
        multiple classes like
        <RouterLink target="_blank" :to="{ name: 'SearchCards', query: { query: 'Goatify' } }"
          >Goatify</RouterLink
        >
        (Rose's signature) still will not be found.
      </p>
    </NotePanel>
    <NotePanel type="error">
      <p>If the value of the <code>class</code> parameter is not valid, it will be ignored.</p>
    </NotePanel>
    <Divider />

    <h2 id="type"><component :is="categories.Type" />Type</h2>
    <p>
      To find cards of a type, you can use
      <code>type:trick</code>. The valid values for the <code>type</code> parameter can be used
      case-insensitively and include the following with their short forms:
    </p>
    <DataTable :value="typeValues" size="small" stripedRows>
      <Column field="regular" header="Regular"></Column>
      <Column field="short" header="Short Form"></Column>
    </DataTable>
    <p>
      Short forms are used the same way as the regular forms. For example,
      <code>type:trick</code> is the same as <code>type:t</code>. The type <code>fighter</code> is a
      combination of the types <code>plant</code> and <code>zombie</code>, so a general term can be
      used for both plant and zombie decks.
    </p>
    <NotePanel type="error">
      <p>If the value of the <code>type</code> parameter is not valid, it will be ignored.</p>
    </NotePanel>
    <Divider />

    <h2 id="tribe"><component :is="categories.Tribe" />Tribe</h2>
    <p>
      To find cards of a tribe, you can use
      <code>tribe:clock</code>.
    </p>

    <NotePanel type="tip">
      <p>
        The parameter <code>t</code> is the short form for both the <code>tribe</code> and
        <code>type</code> parameters. For example, <code>t:berry t:plant</code> will find all
        berries that are plants. However, unlike for the <code>type</code> parameter,
        <code>t:tric</code> will find all tricks because <code>t</code> only checks to see if the
        card contains the phrase in its types or tribes rather than matching it exactly. For similar
        reasons, type short forms will not expand to the full form, and the
        <code>fighter</code> type will not find all plants and zombies.
      </p>
    </NotePanel>
    <Divider />

    <h2 id="abilities"><component :is="categories.Abilities" />Abilities</h2>
    <p>
      To find cards that have certain card abilities, you can use
      <code>abilities:gravestone</code> case-insensitively. Additionally, you can use a phrase to
      include spaces in the ability: <code>abilities:"when played"</code>.
    </p>
    <NotePanel type="tip">
      <p>
        The short form for the <code>abilities</code> parameter is <code>a</code>, so the following
        terms are equivalent: <code>abilities:gravestone</code> and <code>a:gravestone</code>.
      </p>
    </NotePanel>
    <NotePanel type="note">
      <p>
        To include a newline character in a phrase, <code>\n</code> can be written instead:
        <code>abilities:"gravestone\nwhen revealed"</code>.
      </p>
    </NotePanel>
    <NotePanel type="note">
      <p>
        Some cards have images of their keywords or other features in their abilities. To search for
        these images in the abilities text, the image name can be typed between two sets of curly
        brackets (<code>{{ '{' + '{strength}' + '}' }}</code
        >). A more useful example would be to find all cards that pump something +1/+1:
        <code>abilities:"+1{{ '{' + '{strength}' + '}' }}/+1{{ '{' + '{health}' + '}' }}"</code>.
        The following are all the names of the images which appear in the abilities:
      </p>
      <ul>
        <li
          v-for="image in [
            'anti-hero',
            'armored',
            'brain',
            'deadly',
            'doublestrike',
            'frenzy',
            'frozen',
            'heart',
            'overshoot',
            'strength',
            'strikethrough',
            'sun',
            'truestrike',
            'untrickable',
          ]"
          :key="image"
        >
          <span class="ability-list-item"
            ><img :alt="image" :src="`/images/abilities/${image}.png`" /><span>{{
              '{' + '{' + image + '}' + '}'
            }}</span></span
          >
        </li>
      </ul>
    </NotePanel>
    <NotePanel type="warning">
      The formatting of abilities for Sprout might not match the formatting of abilities on the app.
    </NotePanel>
    <Divider />

    <h2 id="flavour"><component :is="categories.Flavour" />Flavour</h2>

    <p>
      To find cards that have a certain flavour text, you can use
      <code>flavour:fun</code> case-insensitively. Additionally, you can use a phrase to include
      spaces in the flavour text: <code>flavour:"miss it"</code>.
    </p>
    <NotePanel type="tip">
      <p>
        The short form for the <code>flavour</code> parameter is <code>f</code>, so the following
        terms are equivalent: <code>flavour:fun</code> and <code>f:fun</code>.
      </p>
    </NotePanel>
    <NotePanel type="note">
      <p>
        To include a double quote character in a phrase ("), <code>\"</code> can be written instead:
        <code>flavour:"\"Please.\""</code>.
      </p>
    </NotePanel>
    <Divider />

    <h2 id="or"><component :is="categories.Or" />Or</h2>
    <p>
      Ors can be used to find cards that are matching one of many conditions. For example, to find
      cards that have abilities when they are played or revealed, the query could be:
      <code>a:"when played" or a:"when revealed"</code>. There can be any number of alternate
      conditions separated by ors: <code>c:1 or c:3 or c:5 or c:7 or c:9</code>.
    </p>
    <p>
      Groups can be made by nesting terms in round brackets to make some terms required and others
      part of the or:
      <code>a:when (a:played or a:revealed)</code>. Further, ors can have more ors within them, like
      the following which finds all tricks and zombies with play or reveal abilities:
      <code>t:trick or t:zombie a:when (a:played or a:revealed)</code>. Groups can be nestled any
      amount of times: <code>(Queen or (Jester s:1 or (cost:3 or cost:5))) or King</code>.
    </p>
    <NotePanel type="error">
      <p>
        If a group is not ended with a closing bracket, everything after the opening bracket is
        treated as though it is in the group.
      </p>
      <p>
        If a closing bracket is in the query without a previous opening bracket, it will be ignored.
      </p>
    </NotePanel>
    <Divider />

    <h2 id="negation"><component :is="categories.Negation" />Negation</h2>
    <p>
      To negate a term, a hyphen (or minus sign) can prepend the parameter. For example, the
      following query will find all cards not costing 3:
      <code>-cost:3</code>. To negate a name, the hyphen can prepend the name: <code>-king</code>.
    </p>
    <NotePanel type="tip">
      <p>
        To find names with a value beginning with a hyphen, a phrase can be used:
        <code>"-nut"</code>.
      </p>
    </NotePanel>

    <Divider />
    <h2 id="include"><component :is="categories.Include" />Include</h2>
    <p>
      To include cards that cannot be put in decks, you can use
      <code>include:all</code>. The valid values for the <code>include</code> parameter can be used
      case-insensitively and include the following with their short forms:
    </p>
    <DataTable :value="includeValues" size="small" stripedRows>
      <Column field="regular" header="Regular"></Column>
      <Column field="short" header="Short Form"></Column>
    </DataTable>
    <p>
      Short forms are used the same way as the regular forms. For example,
      <code>include:all</code> is the same as <code>include:a</code>.
    </p>
    <NotePanel type="tip">
      <p>
        The short form for the <code>include</code> parameter is <code>i</code>, so the following
        terms are equivalent: <code>include:token</code> and <code>i:token</code>.
      </p>
    </NotePanel>
    <NotePanel type="note">
      <p>
        Tokens, removed cards, and superpowers are not included by default, so negating
        <code>include:all</code> will do nothing.
      </p>
    </NotePanel>
    <NotePanel type="note">
      <p>
        If multiple include parameters are in the query, they will not overwrite the previous
        values. For example, <code>include:all</code> is the same as
        <code>include:token include:removed</code> and <code>include:removed include:all</code>.
      </p>
    </NotePanel>
    <NotePanel type="note">
      <p>
        Include statements affect the entire query. For example,
        <code>class:brainy or (class:sneaky include:token)</code> will find all brainy cards and all
        sneaky cards, including tokens for both classes.
      </p>
    </NotePanel>
    <NotePanel type="error">
      <p>If the value of the <code>include</code> parameter is not valid, it will be ignored.</p>
    </NotePanel>
    <ScrollTop />
  </main>
</template>

<script lang="ts" setup>
import {
  AlarmClock,
  BicepsFlexed,
  Blend,
  Brain,
  CirclePlus,
  Grid2X2,
  Heart,
  Leaf,
  MessageSquareQuote,
  MinusCircle,
  Search,
  Shapes,
  ShieldQuestion,
  Signature,
  Star,
  Sun,
  Text,
} from 'lucide-vue-next'
import { Button, Column, DataTable, Divider, ScrollTop } from 'primevue'
import NotePanel from '@/components/NotePanel.vue'

const categories = {
  Name: Signature,
  Cost: Math.random() < 0.5 ? Brain : Sun,
  Strength: BicepsFlexed,
  Health: Heart,
  Is: Leaf,
  Set: Grid2X2,
  Rarity: Star,
  Class: ShieldQuestion,
  Type: Shapes,
  Tribe: AlarmClock,
  Abilities: Text,
  Flavour: MessageSquareQuote,
  Or: Blend,
  Negation: MinusCircle,
  Include: CirclePlus,
}

const isValues = [
  {
    regular: 'plant',
    short: 'p',
  },
  {
    regular: 'zombie',
    short: 'z',
  },
]

const includeValues = [
  {
    regular: 'token',
    short: 't',
  },
  {
    regular: 'removed',
    short: 'r',
  },
  {
    regular: 'superpower',
    short: 's',
  },
  {
    regular: 'all',
    short: 'a',
  },
]

const setValues = [
  {
    regular: 'basic',
    short: 'b',
  },
  {
    regular: 'premium',
    short: 'p',
  },
  {
    regular: 'galactic',
    short: 'g',
  },
  {
    regular: 'colossal',
    short: 'c',
  },
  {
    regular: 'triassic',
    short: 't',
  },
  {
    regular: 'event',
    short: 'e',
  },
  {
    regular: 'superpower',
    short: 's',
  },
]

const rarityValues = [
  {
    regular: 'common',
    short: 'c',
  },
  {
    regular: 'uncommon',
    short: 'u',
  },
  {
    regular: 'rare',
    short: 'r',
  },
  {
    regular: 'superrare',
    short: 's',
  },
  {
    regular: 'legendary',
    short: 'l',
  },
  {
    regular: 'event',
    short: 'e',
  },
  {
    regular: 'token',
    short: 't',
  },
]

const classValues = [
  {
    regular: 'guardian',
  },
  {
    regular: 'kabloom',
  },
  {
    regular: 'megagrow',
  },
  {
    regular: 'smarty',
  },
  {
    regular: 'solar',
  },
  {
    regular: 'beastly',
  },
  {
    regular: 'brainy',
  },
  {
    regular: 'crazy',
  },
  {
    regular: 'hearty',
  },
  {
    regular: 'sneaky',
  },
]

const typeValues = [
  {
    regular: 'plant',
    short: 'p',
  },
  {
    regular: 'zombie',
    short: 'z',
  },
  {
    regular: 'trick',
    short: 't',
  },
  {
    regular: 'environment',
    short: 'e',
  },
  {
    regular: 'fighter',
    short: 'f',
  },
]
</script>

<style scoped>
:target {
  scroll-margin-top: 3em;
}

main {
  max-width: 70ch;
  margin-left: auto;
  margin-right: auto;
}
h1,
h2 {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--inline-space);
}
:is(h1, h2) svg {
  color: var(--p-primary-400);
  width: 1em;
  height: 1em;
  flex-shrink: 0;
}

.center {
  width: 100%;
  text-align: center;
  max-width: unset;
}

.topic-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--inline-space);
  flex-wrap: wrap;
}

.p-datatable {
  margin-bottom: var(--block-space);
}

a {
  color: var(--p-primary-color);
  transition: var(--p-transition-duration);
  text-decoration: none;
}
a:hover {
  color: var(--p-primary-hover-color);
}

p,
:deep(p) {
  line-height: 1.5rem;
}
code {
  /* Style from primevue tag component */

  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: light-dark(
    var(--p-primary-100),
    color-mix(in srgb, var(--p-primary-500), transparent 84%)
  );
  color: light-dark(var(--p-primary-700), var(--p-primary-300));
  font-size: 0.875rem;
  font-weight: 700;
  padding: 0.1rem 0.5rem;
  border-radius: var(--p-content-border-radius);
}

.ability-list-item {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: var(--inline-space);
}
.ability-list-item img {
  height: 1em;
}
</style>
