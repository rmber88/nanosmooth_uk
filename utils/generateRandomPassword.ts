export default function generateRandomPassword(
  length: number,
  options?: {
    includeNumbers?: boolean;
    includeSymbols?: boolean;
    excludeSimilarChars?: boolean;
    excludeChars?: string;
  }
): string {
  let characters =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+[]{};':,.<>/?";

  // Allow excluding specific characters
  if (options?.excludeChars) {
    characters = characters.replace(
      new RegExp(`[${options.excludeChars}]`, "g"),
      ""
    );
  }

  // Allow excluding visually similar characters (like l, 1, I)
  if (options?.excludeSimilarChars) {
    const similarChars = [
      ["l", "1", "I"],
      ["o", "0", "O"],
      ["q", "9"],
    ];
    for (const similarGroup of similarChars) {
      characters = characters.replace(
        new RegExp(`[${similarGroup.join("")}]`, "g"),
        ""
      );
    }
  }

  let password = "";
  const characterPool: any[] = characters.split("");

  // Adjust character pool based on options
  if (options?.includeNumbers) {
    characterPool.push(...[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
  }

  if (options?.includeSymbols) {
    characterPool.push(
      ...[
        "!",
        "@",
        "#",
        "$",
        "%",
        "^",
        "&",
        "*",
        "(",
        ")",
        "-",
        "_",
        "+",
        "=",
        "{",
        "}",
        "[",
        "]",
        ";",
        ":",
        "'",
        ",",
        ".",
        "<",
        ">",
        "/",
        "?",
      ]
    );
  }

  for (let i = 0; i < length; i++) {
    password += characterPool[Math.floor(Math.random() * characterPool.length)];
  }

  return password;
}
