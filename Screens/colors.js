// colors.js
export const getColors = isDarkMode => {
  if (isDarkMode) {
    return {
      background: '#000000',
      text: '#FFFFFF',
      primary: '#0A84FF',
      card: '#1C1C1E',
      border: '#e2e2e2ff',
      heading: '#60A5FA',

      headerBackground: '#1C1C1E',
      headerText: '#FFFFFF',

      familyViewBackground: '#1C1C1E',
      addFormBackground: '#2C2C2E',
      addRowBackground: '#3A3A3C',
      inputBorder: '#3A3A3C',
      inputText: '#FFFFFF',

      plusIcon: 'green',
      selectedEmojiBorder: 'green',

      saveButtonBackground: '#f17583ff',
      cancelButtonBackground: '#cacacaff',
      cancelButtonText: '#000000',

      listBorder: '#3A3A3C',

      container1Background: '#1C1C1E',
      header1Text: '#FFFFFF',
      titleText: '#FFFFFF',
      subtitleText: '#9CA3AF',

      moonIcon: '#FFD700',
      moonIconInactive: '#555',

      aboutIcon: '#9CA3AF',
      sectionTitle: '#FFFFFF',
      itemTitle: '#FFFFFF',
      itemSubtitle: '#9CA3AF',
      footerText: '#9CA3AF',
      heart: 'red',
    };
  } else {
    return {
      background: '#f5faf9ff',
      text: '#000000',
      primary: '#0A84FF',
      card: '#ffffffff',
      border: '#dbdbdbff',
      heading: '#1E40AF',

      headerBackground: 'white',
      headerText: '#000000',

      familyViewBackground: '#fff',
      addFormBackground: '#f9f9f9',
      addRowBackground: '#f0f0f0',
      inputBorder: '#ccc',
      inputText: '#000000',

      plusIcon: 'green',
      selectedEmojiBorder: 'green',

      saveButtonBackground: '#f17583ff',
      cancelButtonBackground: '#cacacaff',
      cancelButtonText: '#000000',

      listBorder: '#eee',

      container1Background: '#fff',
      header1Text: '#1a1a1a',
      titleText: '#1a1a1a',
      subtitleText: '#666',

      moonIcon: '#FFD700',
      moonIconInactive: '#555',

      aboutIcon: '#4B5563',
      sectionTitle: '#111827',
      itemTitle: '#111827',
      itemSubtitle: '#6B7280',
      footerText: '#4B5563',
      heart: 'red',
    };
  }
};
