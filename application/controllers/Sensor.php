<?php
class Sensor extends CI_Controller
{
	public function __construct()
	{
		parent::__construct();
		$this->load->model(array('sensor_model'));
		$this->load->helper('url_helper');
	}

	public function index()
	{
		$sensores = $this->sensor_model->getSensores();
		echo json_encode($sensores);
	}

	public function getData($sensor){
		$data = $this->sensor_model->getData($sensor);
		echo json_encode($data);
	}

	public function getLast($sensor){
		$data = $this->sensor_model->getlastData($sensor);
		echo json_encode($data);
	}

	public function insertar()
	{
		$temperatura = $this->input->post('temp');
		$humedad = $this->input->post('hum');
		$status = $this->sensor_model->insert($temperatura, $humedad);
		
		$this->output->set_status_header($status);
	}
}
