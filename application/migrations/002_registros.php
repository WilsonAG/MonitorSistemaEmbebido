<?php

defined('BASEPATH') or exit('No direct script access allowed');

class Migration_registros extends CI_Migration
{
	public function up()
	{
		/* Creacion de registro actuador */
		$this->dbforge->add_field(array(
			'id' => array(
				'type' => 'INT',
				'constraint' => 5,
				'unsigned' => true,
				'auto_increment' => true
			),
			'fecha' => array(
				'type' => 'TIMESTAMP'
			),
			'modo' => array(
				'type' => 'CHAR',
				'constraint' => 1
			),
			'estado' => array(
				'type' => 'INT',
				'unsigned' => true,
				'null' => true
			),
			'id_actuador' => array(
				'type' => 'INT',
				'constraint' => 5,
				'unsigned' => TRUE
			)
		));
		$this->dbforge->add_key('id', true);
		$this->dbforge->create_table('reg_actuador');

		/* Creacion de registro sensor */
		$this->dbforge->add_field(array(
			'id' => array(
				'type' => 'INT',
				'constraint' => 5,
				'unsigned' => true,
				'auto_increment' => true
			),
			'fecha' => array(
				'type' => 'TIMESTAMP'
			),
			'valor' => array(
				'type' => 'DECIMAL',
				'constraint' => "4,2",
				'unsigned' => true
			),
			'id_sensor' => array(
				'type' => 'INT',
				'constraint' => 5,
				'unsigned' => TRUE
			)
		));
		$this->dbforge->add_key('id', true);
		$this->dbforge->create_table('reg_sensor');
	}

	public function down()
	{
		$this->dbforge->drop_table('reg_sensor');
		$this->dbforge->drop_table('reg_actuador');
	}
}
