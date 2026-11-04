export function getCulqiAppearance(
  dark: boolean,
  fullscreen = false,
): Record<string, unknown> {
  if (fullscreen)
    return {
      theme: dark ? 'dark' : 'default',
      hiddenCulqiLogo: true,
      menuType: 'sidebar',
      buttonCardPayText: 'Pagar Ahora',
      defaultStyle: {
        bannerColor: '#C9974A',
        buttonBackground: '#C9974A',
        menuColor: '#C9974A',
        linksColor: '#C9974A',
        buttonTextColor: dark ? '#FFF' : '#1a1a1a',
        priceColor: '#C9974A',
      },
    };
  return {
    theme: dark ? 'dark' : 'light',
    hiddenCulqiLogo: true,
    hiddenBannerContent: false,
    hiddenBanner: false,
    hiddenToolBarAmount: false,
    menuType: 'select',
    buttonCardPayText: 'Pagar Ahora',
    logo: null,
    defaultStyle: {
      bannerColor: '#C9974A',
      buttonBackground: '#C9974A',
      menuColor: '#C9974A',
      linksColor: '#C9974A',
      buttonTextColor: '#FFFFFF',
      priceColor: '#C9974A',
    },
    variables: {
      fontFamily: "'Inter', system-ui, sans-serif",
      fontWeightNormal: '500',
      borderRadius: '8px',
      colorBackground: '#0b0806',
      colorPrimary: '#C9974A',
      colorPrimaryText: '#FFFFFF',
      colorText: '#FFFFFF',
      colorTextSecondary: '#A1A1AA',
      colorTextPlaceholder: '#727F96',
      colorIconTab: '#C9974A',
      colorLogo: 'dark',
    },
    rules: {
      '.Culqi-Main-Container': {
        background: 'transparent',
        fontFamily: 'var(--fontFamily)',
      },
      '.Culqi-ToolBanner': {
        background: 'linear-gradient(to right, #C9974A, #b38137)',
        fontFamily: 'var(--fontFamily)',
        color: 'white',
        borderRadius: '12px 12px 0 0',
      },
      '.Culqi-Toolbar-Price': {
        color: 'white',
        fontFamily: 'var(--fontFamily)',
      },
      '.Culqi-Main-Method': {
        background: 'transparent',
        padding: '10px 20px',
        color: 'white',
      },
      '.Culqi-Text-Link': {
        color: '#C9974A',
      },
      '.Culqi-Label': {
        color: '#D4D4D8',
        marginBottom: '8px',
      },
      '.Culqi-Input': {
        border: '1px solid #3d2c1f',
        color: 'white',
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '8px',
      },
      '.Culqi-Input:focus': {
        border: '2px solid #C9974A',
        boxShadow: '0 0 0 3px rgba(201, 151, 74, 0.2)',
      },
      '.Culqi-Input.input-valid': {
        border: '1px solid #22c55e',
        background: 'rgba(34, 197, 94, 0.1)',
      },
      '.Culqi-Button': {
        background: 'linear-gradient(to right, #C9974A, #b38137)',
        borderRadius: '8px',
        fontWeight: '600',
        fontFamily: 'var(--fontFamily)',
        padding: '12px',
      },
      '.Culqi-Button:hover': {
        background: 'linear-gradient(to right, #b38137, #966b2d)',
        transform: 'translateY(-1px)',
      },
      '.Culqi-Menu': {
        color: '#A1A1AA',
      },
      '.Culqi-Menu-Item.active': {
        color: '#C9974A',
      },
      '.Culqi-Menu-Item.active .Culqi-Bar': {
        background: '#C9974A',
      },
    },
  };
}
