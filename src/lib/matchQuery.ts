import type { CompareOperator } from "./parse-query/scanner";
import type { Card, Query } from "./types";

export default function doesMatchQuery(card: Card, query: Query): boolean {
  for (const subQuery of query) {
    if (subQuery.property === "or") {
      const isSomeCorrect = subQuery.orSections.some(
        (orQuery) => orQuery.length !== 0 && doesMatchQuery(card, orQuery)
      );
      if (!isSomeCorrect) {
        return false;
      }
    } else {
      if (subQuery.property === "name") {
        const doesNameMatch = card.name
          .toLowerCase()
          .includes(subQuery.value.toString().toLowerCase());
        if (doesNameMatch === subQuery.isNegated) {
          return false;
        }
        continue;
      }
      if (subQuery.property === "strength" || subQuery.property === "s") {
        const doesStrengthMatch =
          card.strength !== null &&
          equalityCheck(card.strength, subQuery.compare, subQuery.value);
        if (doesStrengthMatch === subQuery.isNegated) {
          return false;
        }
        continue;
      }
      if (subQuery.property === "health" || subQuery.property === "h") {
        const doesHealthMatch =
          card.health !== null &&
          equalityCheck(card.health, subQuery.compare, subQuery.value);
        if (doesHealthMatch === subQuery.isNegated) {
          return false;
        }
        continue;
      }
      if (subQuery.property === "cost" || subQuery.property === "c") {
        const doesCostMatch =
          card.cost !== null &&
          equalityCheck(card.cost, subQuery.compare, subQuery.value);
        if (doesCostMatch === subQuery.isNegated) {
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
        const doesMatchSet = card.set.toLowerCase() === set;
        if (doesMatchSet === subQuery.isNegated) {
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

        const doesMatchRarity =
          card.rarity.toLowerCase().replace("-", "") === rarity;
        if (doesMatchRarity === subQuery.isNegated) {
          return false;
        }
        continue;
      }
      if (subQuery.property === "class") {
        const doesMatchClass =
          card.rarity.toLowerCase().replace(/[ -]/g, "") !== subQuery.value;
        if (doesMatchClass === subQuery.isNegated) {
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
          const doesMatchType =
            card.type.toLowerCase() === type ||
            (type === "fighter" &&
              (card.type.toLowerCase() === "zombie" ||
                card.type.toLowerCase() === "plant"));
          if (doesMatchType === subQuery.isNegated) {
            return false;
          }
        } else {
          const doesMatchTribe = [...card.tribes, card.type].some((tribe) =>
            tribe
              .toLowerCase()
              .includes(subQuery.value.toString().toLowerCase())
          );
          if (doesMatchTribe === subQuery.isNegated) {
            return false;
          }
        }
        continue;
      }
      if (subQuery.property === "abilities" || subQuery.property === "a") {
        const doesMatchAbilities = card.abilities
          .toLowerCase()
          .includes(subQuery.value.toString().toLowerCase());
        if (doesMatchAbilities === subQuery.isNegated) {
          return false;
        }
        continue;
      }
      if (subQuery.property === "flavour" || subQuery.property === "f") {
        const doesMatchFlavour = card.flavour
          .toLowerCase()
          .includes(subQuery.value.toString().toLowerCase());
        if (doesMatchFlavour === subQuery.isNegated) {
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
