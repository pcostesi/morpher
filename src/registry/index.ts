import { Transformation } from 'index'
import lowercase from './lowercase'
import required from './required'

export default {
  lowercase: lowercase as Transformation,
  required: required as Transformation,
  '*': required as Transformation,
}
