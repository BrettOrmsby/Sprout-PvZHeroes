import type { CompareOperator } from "./parse-query/scanner";
import type { Card, Query } from "./types";

export default function doesMatchQuery(card: Card, query: Query): boolean {
  for (const subQuery of query) {
    if (subQuery.property === "or") {
      const isSomeCorrect = subQuery.orSections.some((orQuery) =>
        orQuery.length !== 0 && doesMatchQuery(card, orQuery)
      );
      if (!isSomeCorrect) {
        return false;
      }
    } else {
      if (subQuery.property === "name") {
        if (
          !card.name
            .toLowerCase()
            .includes(subQuery.value.toString().toLowerCase())
        ) {
          return false;
        }
        continue;
      }
      if (subQuery.property === "strength" || subQuery.property === "s") {
        if (
          card.strength === null ||
          !equalityCheck(card.strength, subQuery.compare, subQuery.value)
        ) {
          return false;
        }
        continue;
      }
      if (subQuery.property === "health" || subQuery.property === "h") {
        if (
          card.health === null ||
          !equalityCheck(card.health, subQuery.compare, subQuery.value)
        ) {
          return false;
        }
        continue;
      }
      if (subQuery.property === "cost" || subQuery.property === "c") {
        if (!equalityCheck(card.cost, subQuery.compare, subQuery.value)) {
          return false;
        }
        continue;
      }
      if (subQuery.property === "set") {
        let set = subQuery.value.toLowerCase();
        if (set.length === 1) {
          const shortFormSets = {
            b: "basic",
            p: "premium",
            g: "galactic",
            c: "colossal",
            t: "triassic",
            e: "event",
            s: "superpower",
          };
          set = shortFormSets[set as keyof typeof shortFormSets];
        }
        if (card.set.toLowerCase() !== set) {
          return false;
        }
        continue;
      }
      if (subQuery.property === "rarity" || subQuery.property === "r") {
        let rarity = subQuery.value;
        if (rarity.length === 1) {
          const shortFormRarities = {
            c: "common",
            u: "uncommon",
            r: "rare",
            s: "superrare",
            l: "legendary",
            e: "event",
            t: "token",
          } as const;
          rarity = shortFormRarities[rarity as keyof typeof shortFormRarities];
        }
        if (card.rarity.toLowerCase().replace("-", "") !== rarity) {
          return false;
        }
        continue;
      }
      if (subQuery.property === "class") {
        if (card.rarity.toLowerCase().replace(/[ -]/g, "") !== subQuery.value) {
          return false;
        }
        continue;
      }
      if (
        subQuery.property === "tribe" ||
        subQuery.property === "type" ||
        subQuery.property === "t"
      ) {
        if (subQuery.property === "type") {
          let type = subQuery.value;
          if (type.length === 1) {
            const shortFormTypes = {
              p: "plant",
              z: "zombie",
              t: "trick",
              e: "environment",
              f: "fighter",
            } as const;
            type = shortFormTypes[type as keyof typeof shortFormTypes];
          }
          if (
            !(
              card.type.toLowerCase() === type ||
              (type === "fighter" &&
                (card.type.toLowerCase() === "zombie" ||
                  card.type.toLowerCase() === "plant"))
            )
          ) {
            return false;
          }
        } else {
          if (
            ![...card.tribes, card.type].some((tribe) =>
              tribe
                .toLowerCase()
                .includes(subQuery.value.toString().toLowerCase())
            )
          ) {
            return false;
          }
        }
        continue;
      }
      if (subQuery.property === "abilities" || subQuery.property === "a") {
        if (
          !card.abilities
            .toLowerCase()
            .includes(subQuery.value.toString().toLowerCase())
        ) {
          return false;
        }
        continue;
      }
      if (subQuery.property === "flavour" || subQuery.property === "f") {
        if (
          !card.flavour
            .toLowerCase()
            .includes(subQuery.value.toString().toLowerCase())
        ) {
          return false;
        }
        continue;
      }
    }
  }
  return true;
}

function equalityCheck(
  firstVal: number,
  op: CompareOperator,
  secondVal: number
): boolean {
  if (op === ":" || op === "=") return firstVal === secondVal;
  if (op === "<") return firstVal < secondVal;
  if (op === ">") return firstVal > secondVal;
  if (op === "<=") return firstVal <= secondVal;
  return firstVal >= secondVal;
}
