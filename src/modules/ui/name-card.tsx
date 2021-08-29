// color patterns to be randomized and used to generate name card
const colorPatterns = {
  backdrop: ['#e1f4f3'],
  font: ['#28a592']
}

const styles: any = {
  lg: {
    width: '95px',
    height: '95px',
    fontSize: '60px',
    fontWeight: '400'
  },
  md: {

  },
  sm: {

  }
}

export const generateNameCard = (name: string, size: string): any => {

  var index = Math.floor(Math.random() * colorPatterns.backdrop.length);
  var backdrop = colorPatterns.backdrop[index];
  var font = colorPatterns.font[index];
  var style = {
    ...styles[size],
    textAlign: 'center',
    borderRadius: '50%',
    backgroundColor: backdrop,
    color: font
  }

  return (
    <div className="name-card-wrapper" style={style}>
      <span className="name-card-font">{name.charAt(0).toUpperCase()}</span>
    </div>
  );
}