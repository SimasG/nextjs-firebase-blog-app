// "show" is a prop?
export default function Loader({ show }) {
  return show ? <div className="loader"></div> : null;
}
