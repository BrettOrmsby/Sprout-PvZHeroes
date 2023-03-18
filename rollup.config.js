export default {
    output: {
        sanitizeFileName : (e) => {
          return e.replaceAll("\0", "-").replaceAll("?", "-").replaceAll("*", "-")
        }
    }
  };