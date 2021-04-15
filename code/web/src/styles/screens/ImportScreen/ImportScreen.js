import { black, grey } from '../../../ui/common/colors';

export default {
  content: {
    display: 'flex',
    justifyContent: 'center',
    maxWidth: '1200px',
    padding: '0 15px',
    margin: '110px auto'
  },

  secretInput: {
    height: '15em',
    padding: '2em',
    backgroundColor: grey,
    borderRadius: '0.5em',
    marginBottom: '4em',
    textAlign: 'center'
  },

  inputGroup: {
    width: '50em',
    flexDirection: 'row',
    alignItems: 'center',
    textAlign: 'center',
    marginHorizontal: '8em',
  },

  inputContainer: {
    flex: 1,
  },

  input: {
    borderWidth: 0,
    fontSize: '1em',
    color: 'rgb(157, 79, 83)',
  },
  inputName: {
    textAlign: 'center',
    width: '100%',
    color: 'rgb(153, 153, 153)',
    borderWidth: 0,
    height: '3em',
    fontSize: '1em',
    color: 'rgb(157, 79, 83)',
    paddingHorizontal: '2em',
    marginVertical: '2em',
    fontFamily: 'Lato',
    paddingTop: 0,
    backgroundColor: grey,
    paddingBottom: 0,
    borderRadius: '0.5em',
  },

  importItem: {
    margin: '0 50px',
    width: 'calc(20% - 22.5px)',
    position: 'relative',
    boxShadow: '0 0 5px 0 rgba(0,0,0,.1)',
    textAlign: 'center',
    backgroundColor: '#fff',
    padding: '20px 25px 70px',
    borderRadius: '10px',
    cursor: 'pointer'
  },

  disable: {
    disabled: true
  },

  importItemTitle: {
    fontSize: '20px',
    lineHeight: '1.4',
    color: black, 
    fontWeight: '700',
    marginBottom: '15px'
  }


}