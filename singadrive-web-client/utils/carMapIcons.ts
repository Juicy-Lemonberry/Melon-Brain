import { Icon, PointExpression } from 'leaflet';

const ICON_SIZE: PointExpression = [25, 41];
const ICON_ANCHOR: PointExpression = [12, 41];
const POPUP_ANCHOR: PointExpression = [0, -41];

const createCarIcon = (iconUrl: string) => new Icon({
  iconUrl,
  iconSize: ICON_SIZE,
  iconAnchor: ICON_ANCHOR,
  popupAnchor: POPUP_ANCHOR
});

const carIcons = {
  green: createCarIcon('/assets/car-green.png'),
  yellow: createCarIcon('/assets/car-yellow.png'),
  orange: createCarIcon('/assets/car-orange.png'),
  red: createCarIcon('/assets/car-red.png'),
  booked: createCarIcon('/assets/car-booked.png')
};

export default carIcons;

